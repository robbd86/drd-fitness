import React, { useState, useEffect } from 'react';
import { theme } from './theme';
import CryptoJS from 'crypto-js';

// In a real production app, these would be environment variables
// Add constants for security configurations to avoid hardcoding values
const SECURITY_CONFIG = {
  JWT_SECRET: "DRD_FITNESS_JWT_SECRET_KEY_" + new Date().getFullYear(),
  RESET_SECRET: "DRD_FITNESS_RESET_SECRET_KEY_" + new Date().getFullYear(),
  TOKEN_EXPIRY: {
    STANDARD: 24 * 60 * 60 * 1000, // 24 hours
    EXTENDED: 30 * 24 * 60 * 60 * 1000, // 30 days
    RESET: 60 * 60 * 1000, // 1 hour
    TFA: 10 * 60 * 1000 // 10 minutes
  },
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    PBKDF2_ITERATIONS: 10000
  },
  RATE_LIMITING: {
    MAX_ATTEMPTS: 5,
    RESET_TIME: 15 * 60 * 1000, // 15 minutes
    LOCKOUT_DURATION: 30 * 60 * 1000 // 30 minutes
  },
  // Added for CSRF protection
  CSRF_TOKEN_LENGTH: 32
};

// For a production app, this would be handled by a backend service
// This is an improved client-side implementation with localStorage persistence
const getUsersFromStorage = () => {
  try {
    const storedUsers = localStorage.getItem('drd_users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (e) {
    console.error('Error reading users from storage:', e);
    return [];
  }
};

const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('drd_users', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to storage:', e);
  }
};

// Generate a secure random string for CSRF tokens
const generateRandomString = (length) => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

// More secure password hashing using CryptoJS with stronger algorithm
const hashPassword = (password) => {
  // Generate a random salt for each user (in production, store this salt with the user)
  const generateSalt = () => CryptoJS.lib.WordArray.random(16).toString();
  const salt = generateSalt();
  
  // Use PBKDF2 with 10000 iterations (more secure than simple SHA-256)
  const key = CryptoJS.PBKDF2(password, salt, { 
    keySize: 256/32, 
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256
  }).toString();
  
  return {
    salt: salt,
    hash: key
  };
};

// Verify password against stored hash
const verifyPassword = (password, storedHash) => {
  // If old format (just string), use old verification
  if (typeof storedHash === 'string') {
    const salt = "DRD_FITNESS_SECURE_SALT_2025";
    return CryptoJS.SHA256(password + salt).toString() === storedHash;
  }
  
  // New format with salt
  const key = CryptoJS.PBKDF2(password, storedHash.salt, { 
    keySize: 256/32, 
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256
  }).toString();
  
  return key === storedHash.hash;
};

// Generate more secure JWT-like token with CSRF protection
const generateToken = (user, rememberMe = false) => {
  // Generate a separate CSRF token
  const csrfToken = generateRandomString(SECURITY_CONFIG.CSRF_TOKEN_LENGTH/2);
  
  const payload = {
    id: user.id,
    email: user.email,
    // Set token expiration based on "remember me" option
    exp: Date.now() + (rememberMe ? SECURITY_CONFIG.TOKEN_EXPIRY.EXTENDED : SECURITY_CONFIG.TOKEN_EXPIRY.STANDARD), // 30 days or 1 day
    // Add a random nonce for CSRF protection
    nonce: Math.random().toString(36).substring(2, 15),
    // Store CSRF token hash in the JWT
    csrf: CryptoJS.SHA256(csrfToken).toString()
  };
  
  // Sign the token with a secret key
  const secretKey = SECURITY_CONFIG.JWT_SECRET; // In production, use environment variables
  const signature = CryptoJS.HmacSHA256(JSON.stringify(payload), secretKey).toString();
  
  return {
    payload: btoa(JSON.stringify(payload)),
    signature: signature,
    csrfToken: csrfToken // This would be stored in localStorage while the JWT would be in an HTTP-only cookie in production
  };
};

// Validate token with signature verification
export const validateToken = () => {
  try {
    const tokenData = localStorage.getItem('authToken');
    if (!tokenData) return null;
    
    const token = JSON.parse(tokenData);
    const payload = JSON.parse(atob(token.payload));
    
    // Verify token expiration
    if (Date.now() > payload.exp) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('csrfToken');
      return null;
    }
    
    // Verify signature
    const secretKey = SECURITY_CONFIG.JWT_SECRET;
    const expectedSignature = CryptoJS.HmacSHA256(JSON.stringify(payload), secretKey).toString();
    
    if (token.signature !== expectedSignature) {
      console.error("Invalid token signature");
      localStorage.removeItem('authToken');
      localStorage.removeItem('csrfToken');
      return null;
    }
    
    // In a full implementation, we would verify the CSRF token here as well
    const storedCsrfToken = localStorage.getItem('csrfToken');
    if (!storedCsrfToken || CryptoJS.SHA256(storedCsrfToken).toString() !== payload.csrf) {
      console.error("CSRF token validation failed");
      localStorage.removeItem('authToken');
      localStorage.removeItem('csrfToken');
      return null;
    }
    
    return payload;
  } catch (e) {
    console.error("Token validation error:", e);
    localStorage.removeItem('authToken');
    localStorage.removeItem('csrfToken');
    return null;
  }
};

// Generate reset token for password recovery
const generateResetToken = (email) => {
  const payload = {
    email,
    exp: Date.now() + SECURITY_CONFIG.TOKEN_EXPIRY.RESET, // 1 hour expiry
    code: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit code
    // Add unique ID to prevent token reuse
    id: generateRandomString(16)
  };
  
  const secretKey = SECURITY_CONFIG.RESET_SECRET;
  const signature = CryptoJS.HmacSHA256(JSON.stringify(payload), secretKey).toString();
  
  return {
    payload: btoa(JSON.stringify(payload)),
    signature,
    code: payload.code // We'd send this via email in a real app
  };
};

// Validate reset token
const validateResetToken = (token, code) => {
  try {
    const payload = JSON.parse(atob(token.payload));
    
    // Check expiration
    if (Date.now() > payload.exp) {
      return { valid: false, message: "Reset code has expired" };
    }
    
    // Check code
    if (payload.code !== code) {
      return { valid: false, message: "Invalid reset code" };
    }
    
    // Verify signature
    const secretKey = SECURITY_CONFIG.RESET_SECRET;
    const expectedSignature = CryptoJS.HmacSHA256(JSON.stringify(payload), secretKey).toString();
    
    if (token.signature !== expectedSignature) {
      return { valid: false, message: "Invalid token signature" };
    }
    
    return { valid: true, email: payload.email, tokenId: payload.id };
  } catch (e) {
    return { valid: false, message: "Invalid reset token" };
  }
};

// Track used tokens to prevent reuse attacks
const usedResetTokens = new Set();

const Authentication = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  
  // Password reset states
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Load users from localStorage
  const [users, setUsers] = useState(getUsersFromStorage());

  // Save users to localStorage when they change
  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);

  // Check for existing auth on mount
  useEffect(() => {
    const user = validateToken();
    if (user) {
      onAuthenticated(user);
    }
  }, [onAuthenticated]);

  // Email validation
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Enhanced password strength validation
  const validatePassword = (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };
  
  // Rate limiting for authentication attempts (basic implementation)
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  
  const checkRateLimit = () => {
    const now = Date.now();
    
    // Reset counter after 15 minutes
    if (now - lastAttemptTime > SECURITY_CONFIG.RATE_LIMITING.RESET_TIME) {
      setLoginAttempts(1);
      setLastAttemptTime(now);
      return true;
    }
    
    // Increment counter
    setLoginAttempts(prev => prev + 1);
    setLastAttemptTime(now);
    
    // Block if more than 5 attempts in 15 minutes
    return loginAttempts < SECURITY_CONFIG.RATE_LIMITING.MAX_ATTEMPTS;
  };

  // Simulate sending 2FA code (would be SMS/email in real app)
  const sendTwoFactorCode = (user) => {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, this would send the code via SMS or email
    console.log(`Sending 2FA code to ${user.email}: ${code}`);
    
    // Store the code with the user (in a real app, this would be on the server)
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { 
          ...u, 
          twoFactorCode: code,
          twoFactorExpires: Date.now() + SECURITY_CONFIG.TOKEN_EXPIRY.TFA // 10 min expiry
        };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    return code;
  };

  // Verify 2FA code
  const verifyTwoFactorCode = (user, code) => {
    if (!user || !user.twoFactorCode) return false;
    
    // Check if code has expired
    if (Date.now() > user.twoFactorExpires) return false;
    
    return user.twoFactorCode === code;
  };

  const handleLogin = () => {
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user || !verifyPassword(password, user.password)) {
      setError('Invalid email or password');
      
      // Update failed login attempts for account lockout
      if (user) {
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            const failedAttempts = (u.failedAttempts || 0) + 1;
            const accountLocked = failedAttempts >= SECURITY_CONFIG.RATE_LIMITING.MAX_ATTEMPTS;
            const lockUntil = accountLocked ? Date.now() + SECURITY_CONFIG.RATE_LIMITING.LOCKOUT_DURATION : null; // Lock for 30 minutes
            
            return { 
              ...u, 
              failedAttempts,
              accountLocked,
              lockUntil
            };
          }
          return u;
        });
        
        setUsers(updatedUsers);
      }
      
      return;
    }
    
    // Check if account is locked
    if (user.accountLocked && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      setError(`Account is temporarily locked. Try again in ${minutesLeft} minutes.`);
      return;
    }
    
    // Reset failed attempts on successful login
    if (user.failedAttempts) {
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, failedAttempts: 0, accountLocked: false, lockUntil: null };
        }
        return u;
      });
      setUsers(updatedUsers);
    }
    
    // If 2FA is enabled for the user
    if (user.twoFactorEnabled) {
      // Send code and show 2FA input
      sendTwoFactorCode(user);
      setPendingUser(user);
      setShowTwoFactor(true);
      setSuccessMessage('Please enter the verification code sent to your device');
      return;
    }
    
    // Standard login without 2FA
    completeLogin(user);
  };
  
  const handleTwoFactorSubmit = () => {
    if (!pendingUser) return;
    
    if (verifyTwoFactorCode(pendingUser, twoFactorCode)) {
      completeLogin(pendingUser);
      setShowTwoFactor(false);
      setPendingUser(null);
      setTwoFactorCode('');
    } else {
      setError('Invalid verification code or code expired');
    }
  };
  
  const completeLogin = (user) => {
    // Generate and store auth token with CSRF protection
    const token = generateToken(user, rememberMe);
    localStorage.setItem('authToken', JSON.stringify({
      payload: token.payload,
      signature: token.signature
    }));
    localStorage.setItem('csrfToken', token.csrfToken);
    
    // Store last login timestamp
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, lastLogin: new Date().toISOString() };
      }
      return u;
    });
    setUsers(updatedUsers);
    
    setSuccessMessage('Login successful!');
    setTimeout(() => onAuthenticated(user), 1000);
  };

  const handleRegister = () => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      setError('Email already registered');
      return;
    }
    
    // Validate matching passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashPassword(password),
      created: new Date().toISOString(),
      twoFactorEnabled: false
    };
    
    // Update users state and immediately save to localStorage
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers); // Explicitly save to localStorage immediately
    
    setSuccessMessage('Registration successful! Please log in.');
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handlePasswordResetRequest = () => {
    if (!validateEmail(resetEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    const user = users.find(u => u.email === resetEmail);
    if (!user) {
      // Still show success to prevent email enumeration attacks
      setSuccessMessage('If your email exists in our system, you will receive a reset code');
      return;
    }
    
    // Generate reset token
    const token = generateResetToken(resetEmail);
    setResetToken(token);
    
    // In a real app, this would send an email
    setSuccessMessage(`Reset code: ${token.code} (In a real app, this would be sent via email)`);
  };

  const handleVerifyResetCode = () => {
    if (!resetToken || !resetCode) {
      setError('Please enter the reset code');
      return;
    }
    
    const validation = validateResetToken(resetToken, resetCode);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    
    // Check if token has been used before (prevent token reuse)
    if (usedResetTokens.has(validation.tokenId)) {
      setError('This reset code has already been used');
      return;
    }
    
    // Show password reset form
    setSuccessMessage('Code verified. Please enter a new password.');
    setIsResetting(true);
  };

  const handlePasswordReset = () => {
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Get email from validated token
    const validation = validateResetToken(resetToken, resetCode);
    if (!validation.valid) {
      setError('Reset session expired. Please try again.');
      return;
    }
    
    // Prevent token reuse
    if (usedResetTokens.has(validation.tokenId)) {
      setError('This reset code has already been used');
      return;
    }
    
    // Mark token as used
    usedResetTokens.add(validation.tokenId);
    
    // Update user password
    const updatedUsers = users.map(u => {
      if (u.email === validation.email) {
        return { ...u, password: hashPassword(newPassword) };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    setSuccessMessage('Password has been reset successfully. Please log in with your new password.');
    
    // Reset state and show login form
    setIsResetting(false);
    setResetEmail('');
    setResetCode('');
    setResetToken(null);
    setNewPassword('');
    setConfirmNewPassword('');
    setIsLogin(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Rate limiting check
    if (!checkRateLimit()) {
      setError('Too many login attempts. Please try again later.');
      return;
    }

    // Input validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };
  
  // Password reset form
  if (isResetting === 'requestCode') {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Reset Password</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</div>}
        
        <form onSubmit={(e) => { e.preventDefault(); handlePasswordResetRequest(); }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="resetEmail" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              id="resetEmail"
              type="email" 
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send Reset Code
          </button>
          
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                setIsResetting(false); 
                setIsLogin(true);
                setError('');
                setSuccessMessage('');
              }}
              style={{ color: theme.colors.primary, textDecoration: 'none' }}
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    );
  }
  
  // Verify reset code form
  if (isResetting === 'verifyCode') {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Verify Reset Code</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</div>}
        
        <form onSubmit={(e) => { e.preventDefault(); handleVerifyResetCode(); }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="resetCode" style={{ display: 'block', marginBottom: '5px' }}>Reset Code</label>
            <input
              id="resetCode"
              type="text" 
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Verify Code
          </button>
          
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                setIsResetting('requestCode'); 
                setError('');
                setSuccessMessage('');
              }}
              style={{ color: theme.colors.primary, textDecoration: 'none' }}
            >
              Re-send Code
            </a>
          </div>
        </form>
      </div>
    );
  }
  
  // Set new password form
  if (isResetting === 'setNewPassword') {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Set New Password</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</div>}
        
        <form onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
            <input
              id="newPassword"
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="confirmNewPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm New Password</label>
            <input
              id="confirmNewPassword"
              type="password" 
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    );
  }
  
  // Two-factor authentication input 
  if (showTwoFactor) {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Two-Factor Authentication</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</div>}
        
        <form onSubmit={(e) => { e.preventDefault(); handleTwoFactorSubmit(); }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="twoFactorCode" style={{ display: 'block', marginBottom: '5px' }}>Verification Code</label>
            <input
              id="twoFactorCode"
              type="text" 
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Verify
          </button>
          
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                // Resend the code
                if (pendingUser) {
                  sendTwoFactorCode(pendingUser);
                  setSuccessMessage('New verification code sent');
                }
              }}
              style={{ color: theme.colors.primary, textDecoration: 'none' }}
            >
              Resend Code
            </a>
          </div>
        </form>
      </div>
    );
  }

  // Normal login/register form
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>
        {isLogin ? 'Login' : 'Register'} to DRD Fitness
      </h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
        )}
        
        {isLogin && (
          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="rememberMe">Remember me for 30 days</label>
          </div>
        )}
        
        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: theme.colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <a 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }}
            style={{ color: theme.colors.primary, textDecoration: 'none' }}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </a>
        </div>
        
        {isLogin && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                setIsResetting('requestCode');
                setError('');
                setSuccessMessage('');
              }}
              style={{ color: theme.colors.primary, textDecoration: 'none' }}
            >
              Forgot password?
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

// Add the logout function that's being exported but wasn't defined
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('csrfToken');
  // You might want to clear other auth-related data here
  return null;
};

export default Authentication;
export { logout };
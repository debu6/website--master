/**
 * Cookie Verification Guide for Backend
 * 
 * To enable httpOnly cookie verification on the backend:
 * 
 * 1. Update your backend login/register endpoints to return cookies:
 * 
 *    app.post('/api/auth/login', (req, res) => {
 *      // ... authentication logic ...
 *      
 *      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '7d' });
 *      
 *      // Set httpOnly cookie (secure from XSS attacks)
 *      res.cookie('authToken', token, {
 *        httpOnly: true,
 *        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
 *        sameSite: 'strict',
 *        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
 *      });
 *      
 *      res.json({ 
 *        success: true, 
 *        token, // Also send in response for client-side storage if needed
 *        user: { id: user._id, email: user.email, name: user.name } 
 *      });
 *    });
 * 
 * 2. Verify tokens in protected routes:
 * 
 *    const verifyToken = (req, res, next) => {
 *      const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
 *      
 *      if (!token) {
 *        return res.status(401).json({ success: false, message: 'No token provided' });
 *      }
 *      
 *      try {
 *        const decoded = jwt.verify(token, SECRET_KEY);
 *        req.user = decoded;
 *        next();
 *      } catch (error) {
 *        res.status(401).json({ success: false, message: 'Invalid token' });
 *      }
 *    };
 *    
 *    app.get('/api/auth/profile', verifyToken, (req, res) => {
 *      // req.user contains the verified user info
 *      res.json({ success: true, user: req.user });
 *    });
 * 
 * 3. Clear cookies on logout:
 * 
 *    app.post('/api/auth/logout', (req, res) => {
 *      res.clearCookie('authToken');
 *      res.json({ success: true, message: 'Logged out successfully' });
 *    });
 * 
 * Frontend Integration:
 * - The frontend authAPI.ts automatically includes credentials with axios
 * - withCredentials: true allows cookies to be sent/received
 * - getAuthToken() retrieves the token from document.cookie
 * - setAuthToken() stores token in cookies with 7-day expiry
 */

export {};
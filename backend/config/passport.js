const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '714671509629-2ue74rqbh90ngtjtfi8aspa740tlid27.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOCSPX-5k3l8n7m6o5p4q3r2w1e9t8y7u6',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/user/auth/google/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Google OAuth Profile:', profile);
      
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { email: profile.emails[0].value },
          { providerId: profile.id, provider: 'google' }
        ]
      });

      if (user) {
        // Update user if they exist but don't have Google info
        if (!user.providerId || user.provider !== 'google') {
          user.provider = 'google';
          user.providerId = profile.id;
          user.isSocialLogin = true;
          user.profilePicture = profile.photos[0]?.value;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user if doesn't exist
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google',
        providerId: profile.id,
        isSocialLogin: true,
        profilePicture: profile.photos[0]?.value,
        role: 'Client', // Default role for social login
        password: 'google_oauth_' + Math.random().toString(36).substring(2, 15) // Random password for social login
      });

      await newUser.save();
      console.log('✅ New Google user created:', newUser.email);
      return done(null, newUser);

    } catch (error) {
      console.error('❌ Google OAuth Error:', error);
      return done(error, null);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

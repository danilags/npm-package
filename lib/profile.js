var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
    clientID: '268682936876371',
    clientSecret: 'a17a04750351ab2b5e0fb449475cee9f',
    callbackURL: 'http://localhost:8080/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

  // window.fbAsyncInit = function() {
  //   FB.init({
  //     appId      : '268682936876371',
  //     cookie     : true,
  //     xfbml      : true,
  //     version    : 'v2.8'
  //   });
  //   FB.getLoginStatus(function(response) {
  //     statusChangeCallback(response);
  // }, true);
  // };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  function statusChangeCallback(response) {
      console.log(response)
      if (response.status === 'connected') {
        testAPI();
      } else {
        console.log('please login')
      }
  }

  function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', {fields: 'email,name,id'}, function(response) {
        console.log('Successful login for: ' + response.name);
      });
  }

  /* Custom Vue  */

  var app = new Vue({
    el:'#login-button',
    data: {
      statusLogin: true
    },
    computed: {
      classObjectLogin : function() {
        return {
          'nav-item': true,
          'is-tab': true,
          'hidden': this.statusLogin ? true : false
        }
      },
      classObjectLogout : function() {
        return {
          'nav-item': true,
          'is-tab': true,
          'hidden': this.statusLogin ? false : true
        }
      }
    },
    methods: {
      LoginProses : function() {
        FB.login(function(response) {
          // handle the response
          FB.api('/me',{fields: 'email,name,id'}, function(res) {
            console.log(res);
            axios.post('http://localhost:3000/api/login', {
              name        : res.name,
              facebookid  : res.id,
              email       : res.email,
            })
            .then(function(res) {
              localStorage.setItem('token', res.data)
              app.statusLogin = true
              window.location.reload()
            })
          })
          // console.log(response);
        }, {scope: 'email,public_profile', return_scopes: true});
      },
      LogoutProses : function() {
        FB.logout(function() {
          localStorage.removeItem('token')
          window.location.reload()
        })
      },
      checkLogin : function() {
        if(localStorage.getItem('token')) {
          this.statusLogin = true
        } else {
          this.statusLogin = false
        }
      }
    },
    mounted: function() {
      this.checkLogin()
    }
  })

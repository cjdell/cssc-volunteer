module.exports = [

  function() {
    var signUpData = null;

    reset();

    function reset() {
      signUpData = {
        User: {
          Email: 'a@b.c',
          Password: 'password'
        },
        Business: {
          Name: 'Sample Company',
          Type: 'Sole Trader',
          Telephone: '123456'
        },
        Address: {
          Line1: '123 Fake St.',
          Line2: '',
          Town: 'Faketon',
          County: 'Fakeshire',
          Postcode: 'FA1 2KE'
        }
      };
    }

    return {
      signUpData: signUpData,
      reset: reset
    };
  }
];
function xhr(options) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();

    req.open(options.method || 'GET', options.url, true);

    // Set request headers if provided.
    Object.keys(options.headers || {}).forEach(function (key) {
      req.setRequestHeader(key, options.headers[key]);
    });

    req.onreadystatechange = function(e) {
      if(req.readyState !== 4) return;

      if ([200,304].indexOf(req.status) === -1) {
        return reject(new Error('Server responded with a status of ' + req.status));
      } else {
        return resolve(e.target.response);
      }
    };

    req.send(options.data || void 0);
  });
}
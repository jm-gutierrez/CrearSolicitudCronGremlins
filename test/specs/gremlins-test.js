function loadScript(callback) {
  var s = document.createElement('script');
  s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
  if (s.addEventListener) {
    s.addEventListener('load', callback, false);
  } else if (s.readyState) {
    s.onreadystatechange = callback;
  }
  document.body.appendChild(s);
}

function unleashGremlins(ttl, callback) {
  function stop() {
    horde.stop();
    callback();
  }
  var horde = window.gremlins.createHorde().gremlin(
    gremlins.species.clicker().clickTypes(['click']).canClick(
        function(element){
          //return false if the element is neither a link nor a button
          return (element.type == "a" || element.type === "button");
        }
      )
    ).gremlin(
      gremlins.species.formFiller().canFillElement(
        function(element){
          //return false if the element is disabled or is an input which can not be filled with characteres
          return !element.hasAttribute("disabled") && (element.getAttribute('type') != 'button' && element.getAttribute('type') != 'checkbox' && element.getAttribute('type') != 'radio' && element.getAttribute('type') != 'submit');
        }
      )
    ).gremlin(gremlins.species.toucher())
      .gremlin(gremlins.species.scroller());

  horde.seed(1234);
  //Asing priorities to: click => 0.7, fillForm => 0.1, toucher => 0.1 and scroller => 0.1 
  horde.strategy(gremlins.strategies.distribution().distribution([0.7, 0.1, 0.1, 0.1]));

  horde.after(callback);
  window.onbeforeunload = stop;
  setTimeout(stop, ttl);
  horde.unleash();
}

describe('Monkey testing with gremlins ', function() {

  it('it should not raise any error', function() {
    browser.url('/');
    browser.click('button=Cerrar');

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 50000);
  });

  afterAll(function() {
    browser.log('browser').value.forEach(function(log) {
      browser.logger.info(log.message.split(' ')[2]);
    });
  });

});

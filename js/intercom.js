// Intercom loader and helpers
(function(){
  const cfg = window.__INTERCOM_CONFIG__ || {};
  const appId = cfg.APP_ID || document.querySelector('meta[name="intercom-app-id"]')?.content || "";
  const statusEl = document.getElementById('appIdStatus');

  function setStatus(text, ok=false){
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = ok ? '#22c55e' : '#f87171';
  }

  if (appId) { setStatus('APP ID detected: ' + appId, true); }
  else { setStatus('APP ID missing. Edit /js/config.js and set APP_ID.', false); }

  function loadIntercom(settings){
    console.log('loadIntercom called with settings:', settings);
    if (!appId){ 
      console.log('No app ID found!');
      alert('Set APP_ID first in /js/config.js'); 
      return; 
    }
    console.log('Setting intercom settings...');
    window.intercomSettings = Object.assign({ app_id: appId }, settings || {});
    console.log('Final intercom settings:', window.intercomSettings);

    // Intercom boot snippet
    (function(){
      var w=window; var ic=w.Intercom;
      if(typeof ic==='function'){
        ic('reattach_activator'); ic('update', w.intercomSettings);
      }else{
        var d=document; var i=function(){i.c(arguments)}; i.q=[]; i.c=function(args){i.q.push(args)}; w.Intercom=i;
        var l=function(){
          var s=d.createElement('script'); s.type='text/javascript'; s.async=true;
          s.src='https://widget.intercom.io/widget/' + appId;
          var x=d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s,x);
        };
        if(d.readyState==='complete'){ l(); }
        else if(w.attachEvent){ w.attachEvent('onload', l); }
        else { w.addEventListener('load', l, false); }
      }
    })();
  }

  // Buttons
  console.log('Setting up button event listeners...');
  document.getElementById('btnAnon')?.addEventListener('click', () => {
    console.log('Anonymous button clicked!');
    loadIntercom({});
  });

  document.getElementById('userForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value || 'Test User';
    const email = document.getElementById('email').value || 'test@cavpatrol.xyz';
    const user_id = document.getElementById('userId').value || ('user_' + Math.floor(Math.random()*1e6));
    // NOTE: user_hash is optional for basic testing; leave empty unless you implement server-side signing
    loadIntercom({
      name, email, user_id,
      created_at: Math.floor(Date.now()/1000)
      // user_hash: 'SIGN_AT_SERVER' // optional for secure mode
    });
  });

  document.getElementById('btnShow')?.addEventListener('click', () => window.Intercom && window.Intercom('show'));
  document.getElementById('btnHide')?.addEventListener('click', () => window.Intercom && window.Intercom('hide'));
  document.getElementById('btnShutdown')?.addEventListener('click', () => window.Intercom && window.Intercom('shutdown'));
  document.getElementById('btnBoot')?.addEventListener('click', () => {
    // Reboot using the last settings
    if (window.intercomSettings) {
      window.Intercom && window.Intercom('shutdown');
      setTimeout(() => loadIntercom(window.intercomSettings), 150);
    }
  });
})();
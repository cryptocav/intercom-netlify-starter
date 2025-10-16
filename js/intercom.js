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
    
    // For security mode: if providing user data without user_hash, 
    // Intercom will reject it. So we only pass user data if we have user_hash
    const hasUserData = settings.name || settings.email || settings.user_id;
    const hasUserHash = settings.user_hash;
    
    let finalSettings;
    if (hasUserData && !hasUserHash) {
      console.warn('User data provided but no user_hash - loading as anonymous to avoid security errors');
      finalSettings = { app_id: appId }; // Anonymous mode
    } else {
      finalSettings = Object.assign({ app_id: appId }, settings || {});
    }
    
    window.intercomSettings = finalSettings;
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
    
    console.log('Identified user form submitted');
    
    // Since security mode is enabled, we need user_hash for identified users
    // For now, this will load as anonymous (handled in loadIntercom function)
    // To use identified mode, implement server-side user_hash generation
    loadIntercom({
      name, email, user_id,
      created_at: Math.floor(Date.now()/1000)
      // user_hash: 'GENERATE_THIS_ON_SERVER' // Required when security mode is enabled
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
AFRAME.registerSystem('interaction', {
  
  init: function () {
    var inputActions = {
      default: {
        // toggleRaycast: { label: 'Toggle raycast' },
        // scroll: { label: 'change later' },
        // triggerdown: { label: 'change later' },
        // gripdown: { label: 'change later' }
        textPlace: {label: 'Place text'}
      }
    };
    
    var mappings = {
      behaviours: {},
      mappings: {
        default: {
          common: {
            triggerdown: 'textPlace'
          },
          
          'vive-controls': {
            'trigger.down': 'textPlace',
          },

          'oculus-touch-controls': {
            'grip.down': 'textPlace',
          },

          // 'windows-motion-controls': {
          //   'menu.down': 'toggleRaycast'
          // },

          keyboard: {
            'enter_down': 'textPlace',
          }
        }
      }
    };

    this.sceneEl.addEventListener('loaded', function() {
      AFRAME.registerInputActions(inputActions, 'default');
      AFRAME.registerInputMappings(mappings);
      AFRAME.currentMapping = 'default';
    });
  }
});
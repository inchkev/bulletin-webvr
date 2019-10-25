AFRAME.registerSystem('interaction', {
  
  init: function () {
    var inputActions = {
      default: {
        toggleRaycast: { label: 'Toggle raycast' },
        scroll: { label: 'change later' },
        triggerdown: { label: 'change later' },
        gripdown: { label: 'change later' }
      }
    };
    
    var mappings = {
      behaviours: {},
      mappings: {
        default: {
          common: {
//            mousedown: 'gripdown',
//            touchstart: 'gripdown'
          },
          
          'vive-controls': {
            'menu.down': 'toggleRaycast',
            
            'axismove': 'scroll',
          },

          'oculus-touch-controls': {
            'abutton.down': 'toggleRaycast',
            'xbutton.down': 'toggleRaycast',
            
            'axismove': 'scroll',
          },

          'windows-motion-controls': {
            'menu.down': 'toggleRaycast'
          },

          'keyboard': {
            'mousedown': 'gripdown',
            'mousedown': 'triggerdown'
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
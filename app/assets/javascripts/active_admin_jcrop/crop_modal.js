window.active_admin_jcrop = {
  start() {
    if ($('.crop_modal_open').length) {
      $('.crop_modal_open').click(function() {
        const content = $(this).parent().find('.crop_modal_content').clone();
        const image = content.find('img.cropping_image');
        active_admin_jcrop.buttons_text = {
          save_cropped_image: image.data('translateSaveCroppedImage'),
          cancel: image.data('translateCancel')
        };
        active_admin_jcrop.cropper = {
          object_class: image.data('objectClass'),
          object_id: image.data('objectId'),
          crop_field: image.data('cropField'),
          jcropper_url: image.data('jcropperUrl')
        };

        $(content).appendTo('body').dialog({
          width: content.width(),
          height: content.height() + 100,
          modal: true,
          position: {
             my: "center",
             at: "center",
             of: window
          },
          buttons: [
            {
              text: active_admin_jcrop.buttons_text.save_cropped_image,
              click() {
                const submitButton = $('input[type="submit"]')[0];
                submitButton.disabled = true;
                const previousValue = submitButton.value;
                submitButton.value = 'Cropping image...';
                ({text: 'aews'});
                const {
                  cropper
                } = active_admin_jcrop;
                return $.ajax({
                  type: 'PUT',
                  url: cropper.jcropper_url,
                  data: {
                    image_data: cropper
                  },
                  success() {
                    location.reload();
                    submitButton.value = previousValue;
                    return submitButton.disabled = false;
                  },
                  error() {
                    return alert('There was an error while cropping the image');
                  }
                },
                  $(this).dialog('close'));
              }
            },
            {
              text: active_admin_jcrop.buttons_text.cancel,
              click() {
                return $(this).dialog('close').remove();
              }

            }
          ]});
        const options = $.extend({}, image.data('jcropOptions'));
        options.onSelect = function(coords) {
          let fn;
          update_cropper(coords);
          if (image.data('jcropOptions').showDimensions) {
            content.find('.crop_modal_dimensions').first().text(`${coords.w}x${coords.h}`);
          }
          if (fn = image.data('jcropOptions').onSelect) {
            if (typeof fn === 'string') {
              window[fn](coords);
            } else if (typeof fn === 'function') {
              fn(coords);
            }
          }
        };
        options.onChange = function(coords) {
          let fn;
          update_cropper(coords);
          if (image.data('jcropOptions').showDimensions) {
            content.find('.crop_modal_dimensions').first().text(`${coords.w}x${coords.h}`);
          }
          if (fn = image.data('jcropOptions').onChange) {
            if (typeof fn === 'string') {
              window[fn](coords);
            } else if (typeof fn === 'function') {
              fn(coords);
            }
          }
        };
        options.onRelease = function() {
          let fn;
          if (fn = image.data('jcropOptions').onRelease) {
            if (typeof fn === 'string') {
              window[fn](coords);
            } else if (typeof fn === 'function') {
              fn(coords);
            }
          }
        };
        image.Jcrop(options);
      });

      var update_cropper = function(coords) {
        active_admin_jcrop.cropper.crop_x = coords.x;
        active_admin_jcrop.cropper.crop_y = coords.y;
        active_admin_jcrop.cropper.crop_w = coords.w;
        active_admin_jcrop.cropper.crop_h = coords.h;
      };
      return;
    }
  }
};

$(() => active_admin_jcrop.start());

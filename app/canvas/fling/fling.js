'use strict';

dragula([single1], { removeOnSpill: true }).on('remove', function (el) {
      alert('dropped!');
});

/**
  A cloaked view is one that removes its content when scrolled off the screen

  @class CloakedView
  @extends Discourse.View
  @namespace Discourse
  @module Discourse
**/


Discourse.CloakedView = Discourse.View.extend({
  attributeBindings: ['style'],

  init: function() {
    this._super();
    this.set('style', 'height: ' + this.get('defaultHeight') + 'px');
  },

  uncloak: function() {
    var containedView = this.get('containedView');
    if (!containedView) {
      this.setProperties({
        style: null,
        containedView: this.createChildView(Discourse[this.get('cloaks')], { content: this.get('content') })
      });

      this.rerender();
    }
  },

  cloak: function() {
    var containedView = this.get('containedView');
    if (containedView) {
      this.setProperties({
        containedView: null,
        style: 'height: ' + this.$().height() + 'px;'
      });
      this.rerender();
      containedView.remove();
    }
  },

  render: function(buffer) {
    var containedView = this.get('containedView');
    if (containedView && containedView.get('state') !== 'inDOM') {
      containedView.renderToBuffer(buffer);
      containedView.transitionTo('inDOM');
      Em.run.schedule('afterRender', function() {
        containedView.didInsertElement();
      });
    }
  }

});

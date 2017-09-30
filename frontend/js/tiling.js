
// modified Isotope methods for gutters in masonry
$.Isotope.prototype._getMasonryGutterColumns = function() {
  var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
      containerWidth = this.element.width();

  this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
                // or use the size of the first item
                this.$filteredAtoms.outerWidth(true) ||
                // if there's no items, use size of container
                containerWidth;

  this.masonry.columnWidth += gutter;

  this.masonry.cols = Math.floor( ( containerWidth + gutter ) / this.masonry.columnWidth );
  this.masonry.cols = Math.max( this.masonry.cols, 1 );
};

$.Isotope.prototype._masonryReset = function() {
  // layout-specific props
  this.masonry = {};
  // FIXME shouldn't have to call this again
  this._getMasonryGutterColumns();
  var i = this.masonry.cols;
  this.masonry.colYs = [];
  while (i--) {
    this.masonry.colYs.push( 0 );
  }
};

$.Isotope.prototype._masonryResizeChanged = function() {
  var prevSegments = this.masonry.cols;
  // update cols/rows
  this._getMasonryGutterColumns();
  // return if updated cols/rows is not equal to previous
  return ( this.masonry.cols !== prevSegments );
};


$(function(){
  
  var $container = $('#container');
  
  
    // add randomish size classes
    $container.find('.element').each(function(){
      var $this = $(this),
          number = parseInt( $this.find('.number').text(), 10 );
      if ( number % 7 % 2 === 1 ) {
        $this.addClass('width2');
      }
      if ( number % 3 === 0 ) {
        $this.addClass('height2');
      }
    });
  
  $container.isotope({
    itemSelector : '.element',
    masonry : {
      columnWidth : 110,
      gutterWidth : 10
    },
    getSortData : {
      symbol : function( $elem ) {
        return $elem.attr('data-symbol');
      },
      category : function( $elem ) {
        return $elem.attr('data-category');
      },
      number : function( $elem ) {
        return parseInt( $elem.find('.number').text(), 10 );
      },
      weight : function( $elem ) {
        return parseFloat( $elem.find('.weight').text().replace( /[\(\)]/g, '') );
      },
      name : function ( $elem ) {
        return $elem.find('.name').text();
      }
    }
  });
    
  
    var $optionSets = $('#options .option-set'),
        $optionLinks = $optionSets.find('a');

    $optionLinks.click(function(){
      var $this = $(this);
      // don't proceed if already selected
      if ( $this.hasClass('selected') ) {
        return false;
      }
      var $optionSet = $this.parents('.option-set');
      $optionSet.find('.selected').removeClass('selected');
      $this.addClass('selected');

      // make option object dynamically, i.e. { filter: '.my-filter-class' }
      var options = {},
          key = $optionSet.attr('data-option-key'),
          value = $this.attr('data-option-value');
      // parse 'false' as false boolean
      value = value === 'false' ? false : value;
      options[ key ] = value;
      if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
        // changes in layout modes need extra logic
        changeLayoutMode( $this, options )
      } else {
        // otherwise, apply new options
        $container.isotope( options );
      }
      
      return false;
    });


  
    $('#insert a').click(function(){
      var $newEls = $( fakeElement.getGroup() );
      $container.isotope( 'insert', $newEls );

      return false;
    });

    $('#append a').click(function(){
      var $newEls = $( fakeElement.getGroup() );
      $container.append( $newEls ).isotope( 'appended', $newEls );

      return false;
    });


  
    // change size of clicked element
    $container.delegate( '.element', 'click', function(){
      $(this).toggleClass('large');
      $container.isotope('reLayout');
    });

    // toggle variable sizes of all elements
    $('#toggle-sizes').find('a').click(function(){
      $container
        .toggleClass('variable-sizes')
        .isotope('reLayout');
      return false;
    });


  var $sortBy = $('#sort-by');
  $('#shuffle a').click(function(){
    $container.isotope('shuffle');
    $sortBy.find('.selected').removeClass('selected');
    $sortBy.find('[data-option-value="random"]').addClass('selected');
    return false;
  });
  
});

var portfolioTemplate = '<div class="portfolio"><img src="" /></div>';
var portfolioHtml = '';
var _portfolioData = portfolioData.data;

function showPopup(index) {
  var data = _portfolioData[index];
  var $largeImage = $('#portfolioPopup').find('img');
  var $description = $('#portfolioDescription');

  $largeImage.attr('src', data.large_image);
  $description.text(data.description);
  $('#portfolioPopup, #overlay').show();

}

function hasMore() {
  return $('.portfolio').length < _portfolioData.length;
}

function handleHashChangeEvent() {

  var $targetDiv = $(window.location.hash);
  $('.page').hide();

  if(window.location.hash.indexOf('Portfolio') !== -1) {
    displayPortfolio($targetDiv);
  }

  $targetDiv.show();
}

function displayPortfolio($targetDiv) {
  $('.portfolio').unbind();
  $('#loadMore').remove();
  var _stop = false;

  $.each($(portfolioHtml), function(i, v) { //do not append
    var _id = $(v).data('id');
    if( $('.portfolio[data-id="' + _id + '"]').length ) {
      _stop = true;
      return;
    }
  });

  if( !_stop ) {
    $targetDiv.append(portfolioHtml);
  }

  $targetDiv.append((hasMore() ? '<span id="loadMore" class="beforeClearFix">Load More</span>' : ''));

  $('.portfolio').bind('click', function() {
    showPopup($(this).index());
  });
}

function loadPortfolio(per_page, loadMoreClicked) {
  var lowIndex = $('.portfolio').length, highIndex = lowIndex + per_page;

  portfolioHtml = '';

  $.each(_portfolioData, function(i, v) {
    if(i >= lowIndex && i < highIndex) {
      var $template = $(portfolioTemplate);
      $template.attr('data-id', i);
      $template.find('img').attr('src', v.thumbnail);
      portfolioHtml += $template[0] ? $template[0].outerHTML : '';
    }
  });

  if(loadMoreClicked) {
    displayPortfolio($('.page:visible'));
  }

}

$(document).ready(function() {

  $(window).on('hashchange', function(e) {
    e.preventDefault();
    handleHashChangeEvent();
  });

  $('body').on('click', '#loadMore', function() {
    loadPortfolio(portfolioData.per_page, true);
  });

  $('#overlay').click(function() {
    $(this).hide();
    $('.popup:visible').hide();
  });

  // initial state
  loadPortfolio(portfolioData.per_page);
  handleHashChangeEvent();

  if(!window.location.hash) {
    window.location.href = '#pagePortfolio';
  }
});

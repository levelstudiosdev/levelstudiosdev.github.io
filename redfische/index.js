jQuery(document).ready(function() {
    var productPageSlugs = [
        "12-x-30-boat-storage",
        "12-x-40-boat-storage",
        "10-x-10-climate-controlled",
        "10-x-12-climate-controlled",
        "10-x-15-climate-controlled",
        "10-x-10-mini-storage",
        "10-x-12-mini-storage",
    ];
    var urlParts = window.location.href.split('/')
    var wixProductSlug = urlParts[urlParts.length -1];

    if (!productPageSlugs.includes(wixProductSlug)) {
      console.log("page is not a product page");
      return;
    }

    console.log("Product Page " + wixProductSlug);

    // var wixProductSlug = jQuery("#wix-product-slug").val();
    // API endpoint URL
    var apiUrl = "https://redfische.levelstudios.dev/wp-json/inventory/v1/get-inventory?product-type=" + wixProductSlug;

    // Make API request
    jQuery.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);
            // Clear existing dropdown options
            var productDetailsContainer = jQuery("h2:contains(SELECT YOUR UNIT BELOW)").parent().next();
            productDetailsContainer.empty();
            
            jQuery('<div>', {
              'id': 'unit-dropdown-container',
              'style': 'text-align: center;',
            }).appendTo(productDetailsContainer);

            if (!response.length) {
              jQuery("#unit-dropdown-container").html("Out of Inventory");
              return;
            }

            jQuery('<a>', {
              'id': 'stripe-checkout-button',
              'text': 'Checkout',
              'href': 'javascript:void(0);',
              'style': 'padding: 10px 30px 10px 30px; font-weight: bold; font-size: 2em; color: white; background-color: black;',
            }).appendTo(productDetailsContainer);



            // jQuery('#unit-dropdown-container').empty();

            // Create select element
            var select = jQuery('<select>', {
                id: 'unitDropdown'
            });

            // Add "Choose" option
            jQuery('<option>', {
                value: '',
                text: 'Select a Unit'
            }).appendTo(select);

            // Populate dropdown menu with response data
            jQuery.each(response, function(index, item) {
                var option = jQuery('<option>', {
                    value: item['unit-number'],
                    text: "Unit #" + item['unit-number'],
                    'data-location': item['location'],
                    'data-stripe-checkout-link': item['stripe-checkout-link']
                });
                select.append(option);
            });

            // Append select to #apiResponse
            // console.log(jQuery('#unit-dropdown-container'));
            jQuery('#unit-dropdown-container').appendTo(select);
            // var shopifyCheckoutButton = jQuery("#stripe-checkout-button");

            // Event listener for dropdown change
            jQuery('#unit-dropdown-container').on('change', '#unitDropdown', function() {
                var selectedOption = jQuery(this).find('option:selected');
                console.log('change in #unitDropdown ' + selectedOption.val());
                var location = selectedOption.data('location');
                var checkoutLink = selectedOption.data('stripe-checkout-link');
                
                // Enable or disable checkoutLink based on selection
                if (selectedOption.val() !== '') {
                    jQuery('#stripe-checkout-button').removeAttr('disabled');
                } else {
                    jQuery('#stripe-checkout-button').attr('disabled', true);
                }
        
                // Optionally, do something with the location data
                // console.log('Checkout Link:', checkoutLink);
            });

            jQuery('#stripe-checkout-button').on('click', function() {
                var selectedOption = jQuery('#unitDropdown').find('option:selected');
                var location = selectedOption.data('location');
                var checkoutLink = selectedOption.data('stripe-checkout-link');
                
                console.log('Checkout Link:', checkoutLink);

                window.location.replace(checkoutLink);
            });
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error("Error:", error);
            // jQuery('#apiResponse').text("Error fetching data from the API.");
        }
    });

  
});
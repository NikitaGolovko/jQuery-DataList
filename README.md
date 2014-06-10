# jQuery DataList

> jQuery plug-in inspired by ListNav plugin originally created and maintained by [Eric Steinborn](https://github.com/esteinborn/jquery-listnav) will add a slick "letter-based" navigation bar to all of your lists with the proper Bootstrap markup. Click a letter to quickly filter the list to show items that match that letter. The next release of this extension will also add a search functionality that you can bind to your controls.

## Sample
To understand better what this extension accomplishes - check out this [sample page](http://nikitagolovko.github.io/jQuery-DataList/Example.html)!

## Manual Install
#### Insert into &lt;Head&gt;:
<pre><code>&lt;link rel="stylesheet" href="datalist.css"&gt;</code></pre>

#### Code up your list:
<pre><code>&lt;ul id="myList"&gt;...&lt;/ul&gt;</code></pre>

#### Append the search control:
#### Insert before &lt;/body&gt;:
<pre><code>&lt;script src="jQuery-datalist.js"&gt;&lt;/script>
&lt;script&gt;
	$("#myList").datalist();
&lt;/script&gt;</code></pre>

## Options
<pre><code>$("myList").listnav({
	initLetter: '',                     // filter the list to a specific letter on init ('a'-'z', '-' [numbers 0-9], '_' [other])
    optionAll: true,                    // Include the ALL button
    optionOther: false,                // Include a '...' option to filter special charachters by
    optionNums: true,                  // Include a '0-9' option to filter by
    removeDisabled: false,              // Remove the disabled elements from navigation items. Does not apply to artificially added elements (optionAll/optionNums/optionOther)
    notFoundText: 'No matching entries', // set custom text for nav items with no content to show
    searchControlName: '',               // Set the search control ID to bind the search functionality to. 
    navigationClass: 'btn-default'		// Set the navigation control classes. EIther default bootstrap classes: btn-default, btn-primary or your own classes

});</code></pre>
// dependencies
import * as ko from 'knockout'
import mainPage from './components/mainPage'
import { keyhandlerBindingFactory } from './utils'

const ENTER_KEY = 13
const rootElement = document.getElementById('root')

// a custom binding to handle the enter key
ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY)


// render HTML
function render() {
  const element = document.createElement('div')

  element.innerHTML = mainPage
  rootElement.prepend(element)
}

render()

// import and register components
import GoogleMap from './components/googleMap'
import ControlPanel from './components/controlPanel'
import ListingSearchbar from './components/listingSearchbar'

ko.components.register('googlemap', GoogleMap)
ko.components.register('controlpanel', ControlPanel)
ko.components.register('listingsearchbar', ListingSearchbar)

// apply bindings for main ViewModel
function Main() {
  console.log('Knockout is a runnin\' yah. Check out my favorite spots in Osaka Japan!')
  this.listings = []
  this.googleMapsVMInstance = null
  this.controlPanelVMInstance = null

  this.initMaps = function(GoogleMapsVM) {
    GoogleMapsVM.setListings(this.listings)
    GoogleMapsVM.initGoogleMaps()
    this.googleMapsVMInstance = GoogleMapsVM

  }.bind(this)

  this.initControlPanel = function(controlPanel) {
    controlPanel.visableListings.subscribe((listings) => {
      if (this.googleMapsVMInstance)
        this.googleMapsVMInstance.setListings(listings)

      this.listings = listings
    })

    controlPanel.selectedListing.subscribe((listing) => {
      if (this.googleMapsVMInstance)
        this.googleMapsVMInstance.zoomToListing(listing)

    })
    controlPanel.init()

    this.controlPanelVMInstance = controlPanel
  }.bind(this)

  this.initListingSearchbar = function(ListingSearchbar) {
    ListingSearchbar.inputData.subscribe((inputData) => {
      this.controlPanelVMInstance.setSearchInputData(inputData)
    })

  }.bind(this)

}

const MainViewModel = new Main()

ko.applyBindings(MainViewModel, rootElement)

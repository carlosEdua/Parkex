/* eslint-disable */

/**
 * Parkex
 * 2018 carlos eduardo
 * this is a program to emulated a parking lot of the real world
 * you can add or remove vehicles to the Parking lot , also the program
 * calculates the amount that you pay by stand time
 *
 * basically we have 2 classes: Vehicle and ParkLot for create
 *  a new vehicle and a new parking lot
 *
 * the classes do the work to add or remove vehicles and calculate the pricing
 * all the rest is just DOM implementations.
 *
 * NOTE: this code is your and me, so you can modify like you want
 */

//  global functions to get elements from the DOM
const gID = el => document.getElementById(el);
const qS = el => document.querySelector(el);
const qSA = el => document.querySelectorAll(el);


class Vehicle{
    constructor(ownerName,brandCar,model,numberPlate){
        this.ownerName = ownerName;
        this.brandCar = brandCar;
        this.model = model;
        this.numberPlate = numberPlate;
    }
}


class ParkLot{
    constructor(places,hourPrice){
        this.places = new Array(places).fill(0);
        this.hourPrice = hourPrice;
        this.isFull = false;
    }
    //to see if the parking lot is full or not
    _full(){
        this.places.indexOf(0) == -1 ? this.isFull = true : this.isFull = false; 
        return this.places.indexOf(0) == -1 ? true : false; 
    }

    get ocupedPlaces() { 
        return this.places
     }

    //vehicle in position is ocuped?
    isOcuped(position){
        return typeof this.places[position] == 'object' //this return true or false 
    }

    //put in a vehicle
    vehicleIn(vehicle, position){
        if(this._full()) return 'sorry, but all the places are _full';
        else if(typeof this.places[position] == 'object') return 'the place already taken!';

        else{
        this.places[position] = vehicle;
        //get the time when the vehicle check in, as a array
        this.places[position]['start'] = [new Date().getHours(), new Date().getMinutes()]; 
        changeVisualPlace(position,this)//change the color of the place
        }
    }

    //put out a vehicle
    vehicleOut(position){
        //if the place is void
        if(this.places[position] == 0) return 'this vehicle already check out';
        
        else{// the user remenber his number position
            let vehicleObj = this.places[position];
            vehicleObj['end'] = [new Date().getHours(), new Date().getMinutes()]
            changeVisualPlace(position,this,false)//change the color of the place
            this._calculatePrice(vehicleObj.start,vehicleObj.end)
            // exit the vehicle for the array "places" because 0 represent void
            vehicleObj = 0;
        }
        
    }


    // price to pay by the service
    _calculatePrice(start,end){//start[hour,minutes] end[hour,minutes]
        let begin = start[0]*60 + start[1], // hour * 60 + minutes = all the time in minutes
        final = end[0]*60 + end[1],
        transcurred = final - begin, //total time transcurred in minutes
        hour = 0;

        if(transcurred < 0) transcurred += 24 * 60;
        
        for(transcurred; transcurred >= 60 ; transcurred -= 60){
            hour++;
        }
        //NOTE: <transcurred> are here the minutes 
        let hourStr = hour.toString() + ':' + transcurred.toString(),
        toPay = hour * this.hourPrice,
        finalPay;
        if(transcurred == 0) finalPay =  [toPay , hourStr]//if the hour is exact
        //else plus the complete hourPrice or plus hourPrice/2 depend the minutes passed  
        else {
            finalPay = transcurred >= 30 ? [toPay += this.hourPrice,hourStr]:[toPay += (this.hourPrice / 2) ,hourStr];
        }  

        visualExitAndPay(finalPay,start,end,this.hourPrice)
    }

}

function visualExitAndPay(finalPay,start,end,hourPrice){
    gID('visualPay').innerHTML = //html
    `
    <div class="paySubContainer">
    <div id="exit3" class="exit">exit X</div>

        <div>
            you pay $${finalPay[0]}
        </div>
        <div>
            <p><b>the time that you stand:</b> ${finalPay[1]}</p>
            <p><b>start time:</b> ${start.join(':')}</p>
            <p><b>end time:</b> ${end.join(':')}</p>
            <p><b>price per hour:</b> ${hourPrice}</p>
        </div>
    </div>
    `;
    switchCssClass(gID('visualPay'),'activeForm')

    const exit = () => {
        switchCssClass(gID('visualPay'),'activeForm',false);
        gID('exit3').removeEventListener('click',exit)
    }
    gID('exit3').addEventListener('click',exit)
    
}

//          ===========     ATTENTION       ===========
//instance for a new Prking lot
let Park = new ParkLot(12,4)

//show in the DOM all the places of an parking lot
function showPlaces(){
    let placesContainer = gID('placesContainer');
    let places = Park.ocupedPlaces;
    let numPlace = 0;

    placesContainer.innerHTML = '';

    for(let place of places){
    placesContainer.innerHTML += //html 
     `<div onclick="showInfo(${numPlace})" class="place ${typeof place == 'number' ? 'void' : 'ocuped' }">
            <p class="numPlace">${numPlace + 1}</p>
            <p class="ownerNamePlace">${ typeof place == 'number' ? 'available' : place.ownerName }</p>    
            <p class="timeStart"></p>
    </div>`
        numPlace++;   
    }
} 

//=========  change the color and the information about the place depends if it's ocuped or not =============
//change only one place depends if it's ocuped or not
function changeVisualPlace(index,instance,putIn = true){
    let places = [...qSA('.place')], timeStart = [...qSA('.timeStart')];

    let descriptionPlace = qSA('.ownerNamePlace');
    descriptionPlace = [...descriptionPlace];

    if(putIn){
        places[index].classList.remove('void');
        places[index].classList.add('ocuped');
        descriptionPlace[index].textContent = instance.places[index].ownerName;
        timeStart[index].textContent = instance.places[index].start.join(':');
    }else{
        places[index].classList.remove('ocuped');
        places[index].classList.add('void');
        descriptionPlace[index].textContent = 'available';
        timeStart[index].textContent = '';   
    }
    
}

/**
* run the programm 
*/

showPlaces()

//function to add or remove a css class
function switchCssClass(element,className,add = true){
    if(add) element.classList.add(className);
    else element.classList.remove(className)
} 

//          ===============     enter a vehicle     ===============
function enterV(position){
    console.log('the position enter V',position);
    
    switchCssClass(gID('formInContainer'),'activeForm');

    //to exit from the formIn removing the css class
    gID('exit').addEventListener('click',() => {
        switchCssClass(gID('formInContainer'),'activeForm',false);
        //IMPORTANT: the removeEventListener is because the modal window is called
        //several times and  JavaScript remenber all the variables in the scope
        //where the eventListener is executed, so is very important to remove the
        //event listener for each time that the user close the modal window 
        gID('buttonFormIn').removeEventListener('click',addVehicle);       
        }
    );
    //Finally add the vehicle
    const addVehicle = () => {
        
        let ownerName =  gID('username').value,
        brandCar = gID('brand').value,
        carModel = gID('carModel').value,
        numberPlate = gID('serial').value;
        
        console.log('valor de inputs ',ownerName,brandCar);
        let theVehicle = new Vehicle(ownerName,brandCar,carModel,numberPlate);
        Park.vehicleIn(theVehicle,position);
        //remove the event listener to have not acumulated values
        gID('buttonFormIn').removeEventListener('click',addVehicle);

        switchCssClass(gID('formInContainer'),'activeForm',false);
        
        gID('username').value = ''
        gID('brand').value = ''
        gID('carModel').value = ''
        gID('serial').value = ''
    }

    //eventListener for the button to addVehicle() function
    gID('buttonFormIn').addEventListener('click',addVehicle);
    
}


//          ===============     put out a vehicle       ==============
function putOutV(position)
  {
  console.log('the out V',position);
  switchCssClass(gID('formOutContainer'),'activeForm');

    gID('exit2').addEventListener('click',() => {
        switchCssClass(gID('formOutContainer'),'activeForm',false);
        gID('buttonFormOut').removeEventListener('click',exitVehicle);       
        }
    );

    const exitVehicle = () => {
        switchCssClass(gID('formOutContainer'),'activeForm',false);
        gID('buttonFormOut').removeEventListener('click',exitVehicle);
        Park.vehicleOut(position)
    }


    gID('buttonFormOut').addEventListener('click',exitVehicle);       


}


//          ==============      show the pop'up div     ==============
let oldPlacePosition = 0;// to verificate the current position clicked and add or remove pop'ups
function showInfo(n){   //show the pop'up info
    let placesDivs = [...qSA('.place')]
    let isOcuped = Park.isOcuped(n)
    
    let pop = popup(isOcuped,n)//popup div created

    //if the current position is the same position of actual place
    if(n == oldPlacePosition){
        //if the place has the popup
        if(placesDivs[n].querySelector('.popup') != undefined){
            placesDivs[n].removeChild(placesDivs[n].querySelector('.popup'));
        }else{
            placesDivs[n].innerHTML += pop;
        }
    }else{//else the current position is different to old positionPlace
        placesDivs.forEach(el => {//first remove the popup for all the places
            if(el.querySelector('.popup') != undefined){
                el.removeChild(el.querySelector('.popup'))
            }
        })
        placesDivs[n].innerHTML += pop;
        oldPlacePosition = n;
    }
}

//popups to show the place information
function popup(ocuped,position){
    let popupDiv = //html
    `<div class="popup">
    <div class ="popupArrow"></div>
    
        <h2>this place is ${ocuped ? 'ocuped' : 'available'}</h2>
        <button class="${ocuped ? 'popupOcuped' : 'popupAvailable'}"
        onclick="${ ocuped ?  `putOutV(${position})` : `enterV(${position})` }">
            ${ocuped ? 'put out my vehicle' : 'enter my vehicle'}
        </button>

    </div>`

    return popupDiv;
}
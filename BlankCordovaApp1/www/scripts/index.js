// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    var activity = "Freehand";
    var canvas = document.getElementById('pdf-canvas');
    var context = canvas.getContext('2d');
    var isDrawing;
    var lineThickness = 2;
    var n = 0;

    var startX = document.getElementById('startX');
    var startY = document.getElementById('startY');
    var curX = document.getElementById('curX');
    var curY = document.getElementById('curY');

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        var canv = document.getElementById('pdf-canvas');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        canv.setAttribute('style', 'display:none;');

        console.log("navigator.notification =>" + navigator.notification);

        document.getElementById("showpdf").addEventListener("click", doAction);

        document.getElementById("pdf-canvas").addEventListener("touchstart", canvas_touchstart);
        document.getElementById("pdf-canvas").addEventListener("touchmove", canvas_touchmove);
        document.getElementById("pdf-canvas").addEventListener("touchend", canvas_touchend);

        document.getElementById("text").addEventListener("click", writeText);

        document.getElementById("Clear").addEventListener("click", ClearDrawing);
        document.getElementById("Increment").addEventListener("click", Increment);
        document.getElementById("Decrement").addEventListener("click", Decrement);
        document.getElementById("Rectangle").addEventListener("click", Rectangle);
        document.getElementById("Image").addEventListener("click", Image);
        document.getElementById("ReDo").addEventListener("click", ReDo);
        

    };

    function doAction() {

        //navigator.notification.alert(
        //                'Hello From Cordova',  // message
        //                alertDismissed,         // callback
        //                'Game Over',            // title
        //                'Done'                  // buttonName
        //                );

        //var pathToFile = cordova.file.dataDirectory + "helloworld.pdf";
        var filePath = cordova.file.applicationDirectory + "www/helloworld.pdf";
        //window.resolveLocalFileSystemURI(cordova.file.externalRootDirectory, onFileSystemSuccess, onError);
        //window.resolveLocalFileSystemURI(filePath, onFileSystemSuccess, onError);

        window.resolveLocalFileSystemURI(filePath, onFileSystemSuccess, function (e) {
            console.log("error getting file");
        });
    }

    function onFileSystemSuccess(e) {
        console.log("onFileSystemSuccess : enter");
        e.file(function (f) {
            var reader = new FileReader();
            console.log("   after var reader = new FileReader();");
            reader.onloadend = function (evt) {
                console.log("   before PDFJS.getDocument");
                PDFJS.getDocument(new Uint8Array(evt.target.result)).then(function (pdf) {

                    console.log("   after PDFJS.getDocument");

                    pdf.getPage(1).then(function (page) {
                        var scale = 1.5;
                        var viewport = page.getViewport(scale);

                        // Prepare canvas using PDF page dimensions.
                        var canvas = document.getElementById('pdf-canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        var parent = document.getElementById('maindiv');
                        parent.setAttribute('style', 'display:none;');

                        var myCanvas = document.getElementById('pdf-canvas');
                        myCanvas.setAttribute('style', 'display:block;');

                        console.log("   before renderContext");
                        // Render PDF page into canvas context.
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                }, function (error) {
                    console.log("PDFjs error:" + error.message);
                });
            };
            reader.readAsArrayBuffer(f);
        });
    }

    function alertDismissed() {

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function onError(e) {
        navigator.notification.alert("Error : Downloading Failed");
    };

    function canvas_touchstart(e) {
        console.log("canvas_touchstart");
        context.lineWidth = lineThickness;
        var x = e.touches[0].pageX;
        var y = e.touches[0].pageY;

        context.beginPath();
        context.moveTo(x, y);

        isDrawing = true;
        startX.innerHTML = x;
        startY.innerHTML = y;
    };

    function canvas_touchend(e) {
        this.canvas_onmousemove(e);
        context.save();
        isDrawing = false;
    };

    function canvas_touchmove(e) {
        if (isDrawing) {
            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;

            context.lineTo(x, y);
            context.stroke();

            curX.innerHTML = x;
            curY.innerHTML = y;
            context.save();
        }
    };

    function writeText() {
        context.fillStyle = "rgb(64, 255, 64)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "24pt Helvetica";
        showN();
    }

    function showN() {
        context.clearRect(0, 0, canvas.width, canvas.height, 99);
        context.fillText(n, canvas.width / 2, canvas.height / 2);
        context.save();
    }

    function ClearDrawing() {
        context.clearRect(0, 0, canvas.width, canvas.height, 99);
        context.save();
    }

    function Increment() {
        n++;
        showN();
        context.save();
    }

    function Decrement() {
        n--;
        showN();
    }

    function Rectangle() {

        var x = 10;
        var y = 10;
        var width = 80;
        var height = 80;

        context.fillRect(x, y, width, height);
        

        x = 100;
        y = 10;
        width = 80;
        height = 80;
        context.lineWidth = 5;
        context.fillStyle = 'pink';
        context.strokeStyle = 'red';
        context.strokeRect(x, y, width, height);

        x = 50;
        y = 130;
        var radius = 40;
        var startAngle = 0;
        var endAngle = 30;
        context.fillStyle = 'blue';
        context.beginPath();
        endAngle = Math.PI * 2;
        context.arc(x, y, radius, startAngle, endAngle);
        context.fill();

        x = 130;
        y = 130;
        radius = 40;
        startAngle = 0;
        endAngle = 30;
        context.strokeStyle = 'green';
        context.beginPath();
        endAngle = Math.PI * 2;
        context.arc(x, y, radius, startAngle, endAngle);
        context.stroke();

        context.save();
    }

    function Image() {

        var filePath = cordova.file.applicationDirectory + "www/cabinate.png";
        //var img = new Image();
        var img = document.getElementById('myImage');
        context.drawImage(img, 10, 10, 100, 100);

    }

    function ReDo() {
        context.restore();
    }
    function onGetDirectorySuccess(dir) {
        cdr = dir;
        console.log("dir : " + dir);
        dir.getFile(filename, {
            create: true,
            exclusive: false
        }, gotFileEntry, errorHandler);
    };

    function gotFileEntry(fileEntry) {
        // URL in which the pdf is available
        //var documentUrl = "http://localhost:8080/testapp/test.pdf";
        var documentUrl = "http://localhost:4400/BlankCordovaApp1/helloworld.pdf";
        var uri = encodeURI(documentUrl);
        console.log("uri : " + uri.toLocaleString());

        fileTransfer.download(uri, cdr.nativeURL + "test.pdf",
            function (entry) {
                // Logic to open file using file opener plugin
            },
            function (error) {
                navigator.notification.alert(ajaxErrorMsg);
            },
            false
        );
    };

})();
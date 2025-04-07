
var debug = require('debug')(require('path').basename(__filename));

var RandomBackground = function () {
    var self = this;

    self.num_of_background_image = 10;

    self.RandomBackground_Get_Image_File_Name = function (filename_extension) {
        try {
            return (Math.floor((Math.random() * this.num_of_background_image)) + "." + filename_extension);
        }
        catch (e) {
            debug("[RandomBackground] RandomBackground_Get_Image_File_Name() Error " + e);
        }
    };
};

module.exports = RandomBackground;
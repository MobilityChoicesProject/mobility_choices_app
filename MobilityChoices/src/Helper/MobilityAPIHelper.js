export default class MobilityAPIHelper {
    static copyProfileResponse(newProfile, response) {
        var data = response.data;
        newProfile.alreadySynced = data.alreadySynced;
        newProfile.bike = data.bike;
        newProfile.bus = data.bus;
        newProfile.car = data.car;
        newProfile.carType = data.carType;
        newProfile.costValue = data.costValue;
        newProfile.ebike = data.ebike;
        newProfile.ecar = data.ecar;
        newProfile.ecarType = data.ecarType;
        newProfile.email = data.email;
        newProfile.envValue = data.envValue;
        newProfile.ewastage = data.ewastage;
        newProfile.healthValue = data.healthValue;
        newProfile.motorbike = data.motorbike;
        newProfile.timeValue = data.timeValue;
        newProfile.train = data.train;
        newProfile.wastage = data.wastage;

        return newProfile;
    }

    static buildAccessTokenParameter(accessToken) {
        return 'access_token=' + encodeURIComponent(accessToken);
    }
}

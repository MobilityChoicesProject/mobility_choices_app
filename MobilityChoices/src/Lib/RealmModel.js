import Realm from 'realm';

export let realm = new Realm({
    schema: [{
        name: 'LoginData',
        primaryKey: 'userId',
        properties: {
            userId: 'string',
            email: 'string',
            created: 'date',
            authToken: 'string',
            ttl: 'int'
        }
    },
        {
            name: 'Profile',
            primaryKey: 'email',
            properties: {
                email: 'string',
                healthValue: 'int',
                envValue: 'int',
                timeValue: 'int',
                costValue: 'int',
                bike: 'bool',
                ebike: 'bool',
                train: 'bool',
                bus: 'bool',
                motorbike: 'bool',
                car: 'bool',
                ecar: 'bool',
                carType: 'string',
                ecarType: 'string',
                wastage: 'string',
                ewastage: 'string',
                country: 'string',
                city: 'string',
                gender: 'string',
                age: 'int',
                bikeThreshold: 'double',
                footThreshold: 'double',
                changeTrainThreshold: 'double',
                waitingTimeThreshold: 'double',
                footToStationThreshold: 'double',
                bikeToStationThreshold: 'double',
                AcceptPrivacyPolicy: 'bool',
                registerDate: 'date'
            }
        },
        {
            name: 'Track',
            primaryKey: 'id',
            properties: {
                id: 'string',
                email: 'string',
                name: 'string',
                date: 'date',
                isTracking: 'bool',
                isAnalyzing: 'bool',
                reason: 'string'
            }
        },
        {
            name: 'Trackdata',
            foreignKey: 'id',
            properties: {
                id: 'string',
                accuracy: 'double',
                latitude: 'double',
                longitude: 'double',
                altitude: 'double',
                timestamp: 'double',
                confidence: 'double',
                type: 'string',
                speed: 'double'
            }
        },
        {
            name: 'TmdTrack',
            primaryKey: 'id',
            properties: {
                id: 'string',
                name: 'string',
                email: 'string',
                date: 'date',
                reason: 'string',
                type: 'string',
                duration: 'double',
                alreadySynced: 'bool',
                approved: 'bool',
                deletedByClient: 'bool',
                sections: 'Section[]',
                evaluation: {type: 'Evaluation'}
            }
        },
        {
            name: 'Section',
            properties: {
                waypoint: 'bool',
                endpoint: 'bool',
                distance: 'double',
                transportMode: 'string',
                duration: 'double',
                coordinates: 'Coordinates[]',
                start: {type: 'Location'},
                end: {type: 'Location'},
                probabilities: 'ProbabilityData[]',
            }
        },
        {
            name: 'Coordinates',
            properties: {
                lat: 'double',
                lng: 'double'
            }
        },
        {
            name: 'Location',
            properties: {
                name: 'string',
                timestamp: 'double',
                coordinates: {type: 'Coordinates'}
            }
        },
        {
            name: 'ProbabilityData',
            properties: {
                transportMode: 'string',
                probability: 'double',
            }
        },
        {
            name: 'ScoreValues',
            properties: {
                environment: 'double',
                health: 'double',
                time: 'double',
                costs: 'double'
            }
        },
        {
            name: 'IconColor',
            properties: {
                environment: 'string',
                health: 'string',
                time: 'string',
                costs: 'string'
            }
        },
        {
            name: 'Evaluation',
            properties: {
                values: {type: 'ScoreValues'},
                totalscore: 'double?',
                detailscore: {type: 'ScoreValues'},
                iconcolor: {type: 'IconColor'}
            }
        },
        {
            name: 'UserGroups',
            primaryKey: 'email',
            properties: {
                email: 'string',
                usergroups: 'UserGroup[]'
            }
        },
        {
            name: 'UserGroup',
            properties: {
                name: 'string',
                joined: 'bool'
            }
        }
    ],
    schemaVersion: 12
});

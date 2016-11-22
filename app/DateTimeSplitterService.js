GlobalModule.service("DateTimeSplitterService", function ($http, $q) {
    return {
        /**
         * Convert date time to show at their respective places 
         **/
        updateDateTimeList: function (data, $scope) {
            if (data !== 'undefined') {
                angular.forEach(data, function (value, key) {
                    var auditList = data[key];
                    if (data[key] !== "success") {
                        var date = data[key].audit_date;
                        var time = data[key].audit_time;
                        //                        console.log(date);
                        if (date != undefined) {
                            auditList.audit_date = (date.split(' ')[0]);
                            auditList.audit_time = moment.utc(time).toDate();
                        }
                    }
                });
                return data;
            }
        },
        /**
         * Convert date to string 
         **/
        convertDateToString: function (data, $scope) {
            console.log('DATE TYPE: ' + typeof data);
            console.log("STRING DATE: " + data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate());
            return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
        },
        /**
         * Convert time to string
         **/
        convertTimeToString: function (data, $scope) {
            console.log('TIME TYPE: ' + typeof data);
            console.log("STRING TIME: " + data.getTime());
            return moment(data.getTime()).format('hh:mm:ss');
        },
        /**
         * split date
         **/
        splitDateFormat: function (data, $scope) {
            console.log('TIME TYPE: ' + typeof data);
            var date = data.split(' ');
            return date[0];
        },
        
        /**
         * Convert time to string
         **/
        splitTimeFormat: function (data, $scope) {
            console.log('TIME TYPE: ' + data);
            console.log('TIME TYPE: ' + typeof data);
            var date = data.split(' ');
            return date[1];
        }
    };
});

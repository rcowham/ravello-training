'use strict';

angular.module('trng.config').constant('CommonConstants', {
    baseUrl: '',
    autoRefreshDuration: 15000,
    messagesCloseTime: 6000,

	defaultPublishMethod: 'COST_OPTIMIZED',
	defaultCloud: 'AMAZON',
	defaultRegion: 'Virginia',
	defaultAutoStopMillis: -1
});
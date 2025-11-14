let subscribers = [];

const RefreshService = {
    
    subscribe: (callback) => {
        subscribers.push(callback);
        
        return () => {
            subscribers = subscribers.filter(sub => sub !== callback);
        };
    },

    triggerRefresh: () => {
        subscribers.forEach(callback => callback());
    },
};

export default RefreshService;
const setFlash = (req, type, message) => {

    req.session.flash = {
        type,
        message
    };

};


export {
    setFlash
};
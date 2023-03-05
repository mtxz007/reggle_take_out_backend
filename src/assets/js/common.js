const commonjs = {
    isCellPhone(val) {
        return /^1(3|4|5|6|7|8)\d{9}$/.test(val);
    }
}

export default commonjs
const fs = require('fs');
const _ = require('lodash');

/**
 * Convert CSV to JS Object Array
 * 
 * @param {string} inputFile - path desired for output
 * @returns {array}
 */
const convertToArray = (inputFile, options = {}) => {
    const opts = _.defaults(options, {
        // use headers as propKeys
        hasHeaders: true,
    })

    let output = []
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split(/\r\n/);
    // if csv doesn't have headers then just return data
    if (!opts.hasHeaders) return data

    _.each(data, (line, key) => {
        if (opts.hasHeaders && key > 0) output.push(_.zipObject(data[0].split(','), line.split(',')))
    })
    return output
}

/**
 * Exports Object Array to CSV file
 * 
 * @param {string} outputFile - path desired for output
 * @param {array} data - Object array 
 * @returns {boolean}
 */
const makeCSVFile = (outputFile, data) => {
    // cleanup blank lines
    data = _.filter(data, null)

    let headers = []
    _.forEach(data, (value) => {
        headers = _.uniq(_.union(headers, _.keysIn(value)))
    })

    let output = headers.join(',') + '\r\n';
    _.forEach(data, (value) => {
        let result = []
        if (typeof value != 'undefined') {
            _.forEach(headers, (head) => {
                result.push(typeof value[head] != 'undefined' ? value[head] : '')
            })
        }
        output += result.join(',') +  '\r\n'
    })

    try {
        fs.writeFile(outputFile, output, function(err) {
            if(err) {
                return console.log(err);
            }  
            console.log("The CSV file was saved to " + outputFile + "!");
        });
    
    }
    catch (err) {
        console.log(err)
        return false
    }
    return true
}

/**
 * Exports Object Array to JSON file
 * 
 * @param {string} outputFile - path desired for output
 * @param {array} data - Object Array 
 * @returns {boolean}
 */
const makeJSONFile = (outputFile, data) => {
    // cleanup null spaces in array
    data = _.filter(data, null)
    // convert data to json if not string
    if (_.isArray(data)) {
        data = JSON.stringify(data)
    }

    try {
        fs.writeFile(outputFile, data, function(err) {
            if(err) {
                return console.error(err);
            }  
            console.log("The JSON file was saved to " + outputFile + "!");
        });    
    }
    catch (err) {
        console.log(err)
        return false
    }
    return true
}

/**
 * Modify Property Keys to be Camelcase
 * 
 * @param {object} obj
 * @returns {object} - returns a modified clone of the with camelcase for proerty keys
 */
const camelKeys = (obj) => {
    const objClone = _.cloneDeep(obj)
    _.mapKeys(objClone, (value, key) => {
        const camelKey = _.camelCase(key)
        delete objClone[key]
        objClone[camelKey] = value
    })
    return objClone
}

module.exports = {
    convertToArray,
    makeCSVFile,
    makeJSONFile,
    camelKeys,
}
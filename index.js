const fs = require('fs');
const _ = require('lodash');

const csvToJSON = (inputFile, options = {}) => {
    const opts = _.defaults(options, {
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

const makeCSVFile = (outputFile, data) => {
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
    output = output.replace(/^\s*[\r\n]/gm, '')

    fs.writeFile(outputFile, output, function(err) {
        if(err) {
            return console.log(err);
        }  
        console.log("The CSV file was saved to " + outputFile + "!");
    });
}

const makeJSONFile = (outputFile, data) => {
    // cleanup null spaces in array
    data = _.filter(data, null)
    // convert data to json if not string
    if (_.isArray(data)) {
        data = JSON.stringify(data)
    }

    fs.writeFile(outputFile, data, function(err) {
        if(err) {
            return console.log(err);
        }  
        console.log("The JSON file was saved to " + outputFile + "!");
    });
}

const camelKeys = (obj) => {
    _.mapKeys(obj, (value, key) => {
        const camelKey = _.camelCase(key)
        delete obj[key]
        obj[camelKey] = value
    })
    return obj
}

module.exports = {
    camelKeys,
    makeCSVFile,
    csvToJSON,
    makeJSONFile
}
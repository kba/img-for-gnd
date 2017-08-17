const axios = require('axios')
const app = new(require('express'))()

const sparqlTemplate = `\
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
SELECT ?image WHERE {
   ?item wdt:P227 ?gnd.
   ?item wdt:P18 ?image .
}
`
const endpoint = `https://query.wikidata.org/bigdata/namespace/wdq/sparql`

app.get('/:gnd', (req, res, next) => {
    const sparql = sparqlTemplate
        .replace(/\n/g, ' ')
        .replace('?gnd', `"${req.params.gnd}"`)
    const url = `${endpoint}?query=${encodeURIComponent(sparql)}`
    axios.get(url)
        .then(resp => {
            const matches = resp.data.results.bindings
            if (matches.length === 0) {
                res.status(404)
                res.end()
            } else {
                res.status(301)
                res.header('Location', matches[0].image.value)
                res.end()
            }
        })
        .catch(err => next(err))
})
app.listen(5001)

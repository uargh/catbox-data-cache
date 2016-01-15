# catbox-data-cache
IBM BlueMix Data-Cache adapter for catbox

# Features
* cache.drop/cache.get/cache.set - Works
* caching for server.methods.* - Works

### Options

- `credentials` - the IBM BlueMix Data-Cache credentials object.

### Example with glue

```
server: {
  cache: {
    engine: 'catbox-data-cache',
    credentials: credentials['DataCache-1.0'][0].credentials
  }
}
```

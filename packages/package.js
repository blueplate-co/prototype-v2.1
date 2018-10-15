// Information about this package:
Package.describe({
    // Short two-sentence summary
    summary: 'Initial RAW HTML',
    // Version number
    version: '1.0.0'
});

// This defines your actual package:
Package.onUse((api) => {
    api.use('meteorhacks:inject-initial', ['client', 'server']);
});
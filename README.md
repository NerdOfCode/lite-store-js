# Lite Store JS

### Introduction 
Simple abstraction layer over localStorage. Allows for easy addition, removal, or updates to stored key/val data.

Additionally, events can be registered on these actions!

### Start
After importing the library, you will have access to the `LiteStore` singleton.

```javascript
import { LiteStore } from 'LiteStore';
```

### Addition
In order to add data into a keystore, you can do the following:

```javascript
LiteStore.add('key_goes_here', 'val_goes_here');
```

### Updating
In many situations, you will find that you need to update existing data. You can do this, with something like the following:

```javascript
let idx = LiteStore.get('key_goes_here').indexOf('item');

LiteStore.update('key_goes_here', idx, 'Updated data here');
```

### Removal of data
In LiteStore, we have a few different ways to remove data from our store.

#### Mass removal
Perhaps, the easiest way to remove a lot of data at once, is just to purge one of the "keys" in our store.

We can accomplish this, with the following:
```javascript
LiteStore.removeKey('key_goes_here');
```

### Events
Sometimes, you may find that you need to run custom code outside of LiteStore when a specific action happens. Thankfully, that's rather easy to do.

Below you will find examples on how to register each respective event:
### Add/Remove/Update Events
```javascript
let addFn = (updatedStore) => {
  /* custom logic here */
}

LiteStore.registerEvent('add', addFn);
LiteStore.registerEvent('remove', addFn);
LiteStore.registerEvent('update', addFn);
```

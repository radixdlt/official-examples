# 16. Candy Store with an Owned Gumball Machine

In the last example we looked at a candy store package made up of several
blueprints. This example will show how to do the same thing in a different way.
We will still have a candy store component containing a gumball machine
component. The difference this time, will be the gumball machine will be
**owned** by the candy store.

There are two broad ways to modularise your components, each with distinct
advantages.

1. Global components: Like all the components from the previous examples, these
   are created at the global level and are accessible to all other components on
   the ledger.
2. Owned components: Internal to other components, they are only accessible to
   those parent components.

- [Using the Candy Store](#using-the-candy-store)
  - [Setup](#setup)
  - [Use](#use)

## Using the Candy Store

The steps here are the same as for the previous example. There are a few small
differences in what you will see when running the commands, but the overall
process is the same.

### Setup

1. First, clone the repository if you have not done so, and then change
   directory to this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/15-candy-store-owned-modules
   ```

2. From the example's directory, run the setup script.

   On Linux or macOS:

   ```sh
   cd 15-candy-store-owned-modules/
   source ./setup.sh
   ```

   On Windows:

   ```cmd
   cd 15-candy-store-owned-modules/
   ./setup.bat
   ```

   This will reset the simulator, build the package, publish it to the simulator
   and export several useful useful values.

3. Instantiate the component by using the `instantiate_candy_store.rtm`
   manifest.

   You may wish to modify the gumball price in the manifest before running it.

   ```sh
   resim run ../manifests/instantiate_candy_store.rtm
   ```

   Note the number of `New Entities` created. A different number of components
   will be listed depending on which example you are running. As the owned
   component is not globally addressable, it is not counted as a new entity.

4. Export the component and owner badge addresses. These will be displayed in
   the output of the previous command. To check the addresses use
   `resim show <ADDRESS>`. The badge can also be found with its name when
   inspecting the default account (`resim show $account`).

   ```sh
   export component=<YOUR COMPONENT ADDRESS>
   export owner_badge=<YOUR OWNER BADGE ADDRESS>
   ```

### Use

After instantiation the components methods can be called in the same way as with
previous examples. Either by using the `resim call-method` command or by using
the `resim run` followed by the radix transaction manifest path of choice. The
manifests are located in the `manifests` directory.

## License

The Radix Official Examples code is released under Radix Modified MIT License.

    Copyright 2024 Radix Publishing Ltd

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software for non-production informational and educational purposes without
    restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    This notice shall be included in all copies or substantial portions of the
    Software.

    THE SOFTWARE HAS BEEN CREATED AND IS PROVIDED FOR NON-PRODUCTION, INFORMATIONAL
    AND EDUCATIONAL PURPOSES ONLY.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE, ERROR-FREE PERFORMANCE AND NONINFRINGEMENT. IN NO
    EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES,
    COSTS OR OTHER LIABILITY OF ANY NATURE WHATSOEVER, WHETHER IN AN ACTION OF
    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE, MISUSE OR OTHER DEALINGS IN THE SOFTWARE. THE AUTHORS SHALL
    OWE NO DUTY OF CARE OR FIDUCIARY DUTIES TO USERS OF THE SOFTWARE.

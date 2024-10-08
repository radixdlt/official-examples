# 15. Candy Store with a Gumball Machine

Up until now we've had packages of only one blueprint. Here we've created a
package with more. A candy store containing only a single gumball machine (no
other candy) is be represented with blueprints that, when instantiated, become
two components.

There are two broad ways to do this, with distinct advantages. This example
covers a version using only global components. The other version, using owned
components, is covered in the next example.

- [Using the Candy Store](#using-the-candy-store)
  - [Setup](#setup)
  - [Use](#use)

## Using the Candy Store

The multi-blueprint package is set and used in the same way as our previous
single blueprint packages.

### Setup

1. First, clone the repository if you have not done so, and then change
   directory to this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/14-candy-store-modules
   ```

2. From the example's directory, run the setup script.

   On Linux or macOS:

   ```sh
   cd 14-candy-store-modules/
   source ./setup.sh
   ```

   On Windows:

   ```cmd
   cd 14-candy-store-modules/
   ./setup.bat
   ```

   This will reset the simulator, build the package, publish it to the simulator
   and export several useful useful values.

3. Instantiate the component by using the `instantiate_candy_store.rtm`
   manifest.

   You may wish to modify the gumball price in the manifest before running it.

   ```sh
   resim run manifests/instantiate_candy_store.rtm
   ```

   Note the number of `New Entities` created. You should be able to see both the
   new components there.

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

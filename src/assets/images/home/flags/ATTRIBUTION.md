# Flag assets

The SVG flags in this folder come from [flag-icons](https://github.com/lipis/flag-icons) 7.5.0,
square (`1x1`) set. The square set is used because the flags render inside a circular mask, so a
1:1 source fills it without cropping.

The files are copied into the repository on purpose. `flag-icons` is **not** a project dependency
and the flags are **never** requested from a remote flag service, which is the rule stated in
`src/app/feature/pages/home/home-content.config.ts`.

Adding a country means copying its SVG here, adding its code to `CountryPresence` in
`home-content.models.ts`, and adding the entry to `HOME_CONTENT.countries`.

## License

The MIT License (MIT)

Copyright (c) 2013 Panayiotis Lipiridis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# WEBSF.main
## Time API
### RTime
`RTime` is an interface for dealing with time values relative to some point. Maximum accuracy is in nanoseconds.

#### `RTime {}`
##### `@static fromSeconds(sec)`
Return a new instance of `RTime` parsed from the given value in seconds.

##### `@static fromMs(sec)`
Return a new instance of `RTime` parsed from the given value in milliseconds.

##### `@static fromSteps(step, time)`
Return a new instance of `RTime` parsed from the given value in steps.

For example, when `step` is set to 200, and `time` is set to 1919810, then the returned instance is an equivilant representation of 9599.05 seconds.

##### `@static fromText(text)`
Parse time in `DD:MM:SS.XXX` or in `DD:MM:SS-F/F` fashion.

##### `@static fromJSON(json)`
Parse time expressed in JSON format.

##### `@static fromObject(object)`
Return a new instance of `RTime` parsed from the given object.
<pre>{
	"d": // in days
	"h": // in hours
	"m": // in minutes
	"s": // in seconds
	"ms": // in milliseconds
	"us": // in microseconds
	"ns": // in nanoseconds
}</pre>

##### `to(optionString)`
Returns an object which contains the parsed time. Every parameter is in integer. The object has the same structure of the required object of `fromObject()` function.
<pre>{
	"d": // in days (require option 'd' to enable)
	"h": // in hours (require option 'h' to enable)
	"m": // in minutes
	"s": // in seconds
	"ms": // in milliseconds
	"us": // in microseconds (require option 'u' to enable)
	"ns": // in nanoseconds (require option 'n' to enable)
}</pre>

#### `toSteps()`
Return time in steps.

##### `toJSON()`
Serialize time into JSON format.

##### `toText(format)`
Serialize time into a human-friendly format. Default format: `01:02`(MM:SS).

* **format**: Serialized formats to choose from.
    * *ms*: Default format (MM:SS)
    * *h* (after "ms"): Defines an 100ms accuracy in the text. (MM:SS.X)
    * *d* (after "ms"): Defines an 10ms accuracy in the text. (MM:SS.XX)
    * *m* (after "ms"): Defines an 1ms accuracy in the text. (MM:SS.XXX)
    * *s* (after "ms"): Include steps. (MM:SS-F/F)
    * *h* (before "ms"): Make the output text to include hours. (HH:MM:SS)
    * *d* (before "ms"): Make the output text to include days and hours. (DD:HH:MM:SS)

For example, with "hmsd" you will get an output of `HH:MM:SS.XX` (`01:14:51.40`), or with "mss" you will get an output of `MM:SS-FF/FFF` (`19:19:81-00/100`, if the instance has a `steps` property and is set to `100`).

### HARTime
`HARTime` is an interface for getting time values with high accuracy. The basic accuracy is in milliseconds (ms), and if the platform supports, the accuracy can go further into microseconds (us) or nanoseconds (ns). Inherited from `RTime`.

#### `HARTime {}`
##### `now()`
Get high resolution time relative to the beginning of its creation in milliseconds.

##### `nowStep(step)`
Get high resolution time relative to the beginning of its creation) in steps. It will never return floating point numbers, thus its value is rounded down.

* **step**: Define how many steps are in a second. For example, if you define it to 50, then 114514 would mean 2290.28 seconds.

##### `nowRT()`
Get high resolution time relative to the beginning of its creation inside a new `RTime` instance.

# WEBSF.ext
## Time API
### Stopwatch
`Stopwatch` is an interface for use of regular time keeping, or for use in some benchmarking/performance testing applications.
#### (dependencies)
* `websf.main@webcirque`

#### `Stopwatch {}`

##### `point()`
Start or resume the current `Stopwatch` instance. If it is resumed, it will return -1, or otherwise the relative time of execution of the function.

##### `pause()`
Pause the current `Stopwatch` instance. Throws an error if already paused.

##### `stop()`
Stop to keep time, and reset to original state.

Returns the total time of the specific instance if it has been successfully reset. Throws an error if failed.

##### `sum()`
Returns the relative time of execution of the function.

##### `count()`
Returns the total execution count of `point()` function.

##### `mean()`
Returns the average time between every execution of `point()` function.

##### `flag()`
Record the time of execution of this function into ```Stopwatch.flags```.

##### `flags`
A list of recorded time. ```Constructed with StopwatchFlag object.```

#### `StopwatchFlag`
##### `id`
A cumulative ID for representing the order of records.

##### `at`
The time flag was recorded.

##### `class`
The belonging class of a certain flag.

##### `label`
Label of a certain flag.

#### `StopwatchFlags`
##### `classes`
Mapped indeces of classes.

##### `getClass(class)`
Short hand of `StopwatchFlags.classes.get(class)`.


# Stacker

Stacker helps you stay focused on your current task while helping you to remember the overall problem context while programming.

Stacker is strongly inspired by the [Mikado Method](http://mikadomethod.info/).

## Installing Stacker

Clone the repo and then run this command:

```shell
$ npm install -g ./
```

## How to use Stacker

To start, `init` your stack.

```shell
$ stacker init
```

Then, push your current programming task onto the stack.

```shell
$ stacker push "make a GET call to /foods"
```

When you discover a new task you need to perform before you current task can be successfully completed, push that task on to the stack.

```shell
$ stacker push "wire up Food controller"
...
stacker push "look up all items in the FOODS table"
```

As you complete tasks, pop them off the stack to see the next one.

```shell
$ stacker pop
```

If you are using Stacker to pre-write commit messages, you can use the current task as a git commit message 
using the `commit` command (this will also pop the task).

```shell
$ git commit -m (stacker commit)
```

You can always be reminded of what you're currently working on.


```shell
$ stacker peek
```

Eventually you will be done:

```shell
$ stacker pop
Nothing to pop!
```

## Visualizing the Stack

You can check how deep in the stack you are at any time.

```shell
$ stacker stack
```

This will show you the stack. Here is an example for baking a pizza:

```
stacker stack
make dough into a disc
 └─┬ put tomato sauce on pizza
   └─┬ cover pizza with cheese
     └─┬ bake pizza in oven
```

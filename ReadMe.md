# genetic.js

genetic.js is an easy-to-use genetic algorithm wrapper. Provide the library with your initial population and fitness function and it'll do the rest.

```
npm install genetic.js
```
### Getting Started

1. Include it.

    `var GeneticAlgorithm = require("./ga");`

2.  Initialize the GeneticAlgorithm object with your fitness function and initial population.
    
    `var ga = new GeneticAlgorithm(fitness, initial_population);`

3. Run your desired genetic algorithm. Here we'll used fixed-length string encoding and run it for 100 iterations.

    `var result = ga.run("FSLC", "ITERATIONS", 100);`

### Reference

`constructor(fitness, initial_population)`

**Parameters**

 - **fitness**
     Function to calculate the fitness of an individual in the population. The function must accept the following parameters passed to it as the genetic algorithm is run.
     
     - **individual**: an array of 0s and 1s
     - **population**: an array of the current generation of individuals
     - **individual_num**: the index of `individual` in `population`; `population[individual_num] = individual`.
         This parameter is provided so that, if necessary, values in the fitness function (e.g. the average fitness of the population) can be cached. (For an example, see the next section of this Read Me.)

 - **initial_population**
     A starting population for the genetic algorithm represented by a 2D array of integers, with value either 0 or 1. 
    Each individual in the starting population is an array of 0s and 1s. The starting population itself is an array of these individuals.  
  

`run(encoding, convergence_type, convergence_val, [data_size], [p_crossover], [p_mutate], [p_insert], [p_delete])`

**Parameters**

 - **encoding**
    Either `"FSLC"` for fixed-length encoding or `"VSLC"` for variable-length encoding. If using `"VSLC"`, the `data_size` parameter must also be specified.
    
 - **convergence_type**
    `"ITERATIONS"` or `"IMPROVEMENT"`. If `"ITERATIONS"` is specified, the genetic algorithm will run for `convergence_val` generations. If `"IMPROVEMENT"` is specified, the genetic algorithm will run until the improvement between the best solution and the best candidate in the last generation is less than `convergence_val`.

 - **convergence_val**
     See previous parameter description.
     
 - **[data_size]**
    This parameter must be specified if using `"VSLC"`. `data_size` is the size of the chunks data that the insertion and deletion operators will operate on.

 - **[p_crossover]**
    The percentage of individuals that experience crossover. Default value is 0.6.

 - **[p_mutate]**
    The percentage of bits that experience mutation. Default value is 0.05. 

 - **[p_insert]**
    `"VSLC"`only. The percentage of individuals that the insertion operator is applied to.

 - **[p_delete]**
     `"VSLC"`only. The percentage of individuals that the deletion operator is applied to.

### Example

In the following example, we write a genetic algorithm to attempt to return a string full of 1's.

```
var fitnessCache = {
    fitness = [],
    average_fitness = 0
}

/* 
 * Let's say that our fitness is calculated as the number of 
 * 1's in the string divided by the average fitness of the 
 * generation
 */
function fitness(individual, population, i) {

    /*
     * Only recompute the fitnesses when we're starting on a new 
     * generation - aka at the first individual in the population; 
     * this prevents redundant computation to calculate the average 
     * fitness
     */
    (if i == 0) {
        var fitness_sum = 0;
        population.map(function (val) {
            var score = individual.reduce(function (acc, val) {
                return acc + val;
            }
            fitnessCache.fitness.push(score);
            fitness_sum += score;
        }
        var population_size = population.length;
        fitnessCache.average_fitness = fitness_sum / population_size;
    }
    return fitnessCache.fitness[i];
    
}

var initial_population = ["01010", "11000", "00000"]

var ga = new GeneticAlgorithm(fitness, initial_population)

/*
 * When using variable-length encoding, we must provide the data_size. 
 * Since we want the insertion and deletion operators to either add 
 * or remove a single bit, data_size = 1.
 */
var result = ga.run("VSLC", "ITERATIONS", 200, 1);

console.log(result);
```

### License

This project is licensed under the MIT License.
class GeneticAlgorithm {

    /**
     * @param fitness - a function that given a bit vector, calculates its fitness
     *                  relative to others in the population
     *                  (output used directly as reproduction count)
     * @param population - an array of bit vectors
     */

    constructor(fitness, population) {
        this.fitness = fitness;
        this.population = population;
    }

    /**
     * @param encoding - encoding scheme; either FSLC or VSLC
     * @param convergence_type - ITERATIONS or IMPROVEMENT
     * @param convergence_val - number of iterations to run or minimum improvement required
     * @param data_size - if VSLC is being used, user must state how many bits should be
     *                    inserted/deleted
     * @param p_crossover - probabilities for various genetic modifiers
     * @param p_mutate
     * @param p_insert
     * @param p_delete
     */

    run(encoding, convergence_type, convergence_val, data_size=0, p_crossover=0.6, p_mutate=0.05, p_insert=0.001, p_delete=0.001) {

        this.data_size = data_size;
        this.p_crossover = p_crossover;
        this.p_mutate = p_mutate;
        this.p_insert = p_insert;
        this.p_delete = p_delete;

        // initial generation
        var generation = {
            population: this.population,
            bestIndividual: [],
            bestFitness: 0,
            improvement: 0
        }

        if (convergence_type == "ITERATIONS") {

            if (convergence_val < 1)
                throw 'Invalid convergence value; must run at least 1 iteration';

            for (var i = 0; i < convergence_val; i++) {
                generation = this._getNextGeneration(generation, encoding);
            }

            return generation.bestIndividual;

        } else if (convergence_type == "IMPROVEMENT") {

            do {
                generation = this._getNextGeneration(generation, encoding);
            } while (generation.improvement > convergence_val);

            return generation.bestIndividual;

        } else
            throw 'Invalid convergence type; must be "ITERATIONS" or "IMPROVEMENT"';

    }

    _getNextGeneration(generation, encoding) {

        var population = generation.population;
        population = this._reproduce(population);
        population = this._crossover(population);
        population = this._mutate(population);

        if (encoding == "VSLC") {
            population = this._insert(population);
            population = this._delete(population);
        }

        var bestIndividual;
        var bestFitness;
        for (var i = 0; i < population.length; i++) {

            var fitness = this.fitness(population[i], population, i);
            if (!bestIndividual || fitness > bestFitness) {
                bestIndividual = population[i];
                bestFitness = fitness;
            }

        }

        generation.improvement = bestFitness - generation.bestFitness;

        if (!generation.bestIndividual || bestFitness > generation.bestFitness) {
            generation.bestIndividual = bestIndividual.slice();
            generation.bestFitness = bestFitness;
        }

        return generation;

    }

    _reproduce(population) {

        var newPopulation = [];
        for (var i = 0; i < population.length; i++) {
            
            var fitness = this.fitness(population[i], population, i);
            var guaranteed = Math.floor(fitness);
            var p_extra = fitness - guaranteed;

            for (var j = 0; j < guaranteed; j++) {
                newPopulation.push(population[i]);
            }

            if (Math.random() < p_extra)
                newPopulation.push(population[i]);

        }

        return newPopulation;

    }

    _crossover(population) {

        var crossover = [];
        for (var i = 0; i < population.length; i+=2) {
            if (Math.random < this.p_crossover)
                crossover.push(i);
        }

        while (crossover.length > 1) {

            var a, b;
            
            a = Math.floor(Math.random() * crossover.length);
            var indexA = crossover[a];
            crossover.splice(indexA, 1);

            if (crossover.length > 1) {
                do {
                    b = Math.floor(Math.random() * crossover.length);
                } while (a == b);
            } else {
                b = 0;
            }
            var indexB = crossover[b];
            crossover.splice(indexB, 1);

            var individualA = population[indexA];
            var individualB = population[indexB];

            // two-site crossover
            var c1, c2;
            var length = individualA.length < individualB.length ? individualA.length : individualB.length;
            c1 = Math.floor(Math.random() * length);
            do {
                c2 = Math.floor(Math.random() * length);
            } while (c2 == c1);

            if (c1 > c2) {
                var temp = c1;
                c1 = c2;
                c2 = temp;
            }

            var newIndividualA = individualA.slice(0, c1).concat(individualB.slice(c1, c2).concat(individualA.slice(c2)));
            var newIndividualB = individualB.slice(0, c1).concat(individualA.slice(c1, c2).concat(individualB.slice(c2)));

            population[indexA] = newIndividualA;
            population[indexB] = newIndividualB;
            
        }

        return population;

    }

    _mutate(population) {

        for (var i = 0; i < population.length; i++) {
            for (var j = 0; j < population[i].length; j++) {
                if (Math.random() < this.p_mutate) {
                    if (population[i][j] == 0)
                        population[i][j] = 1;
                    else
                        population[i][j] = 0;
                }
            }
        }

        return population;

    }

    /* VSLC only */

    _insert(population) {

        for (var i = 0; i < population.length; i++) {
            if (Math.random() < this.p_insert) {
                for (var j = 0; j < this.data_size; j++) {
                    var bit = Math.floor(Math.random() * 2);
                    population[i].push(bit);
                }
            }
        }

        return population;

    }

    _delete(population) {

        for (var i = 0; i < population.length; i++) {
            if (Math.random() < this.p_delete) {
                var deleteIndex = Math.floor((population[i].length / this.data_size) * Math.random());
                population[i].splice(deleteIndex, this.data_size);
            }
        }

        return population;

    }

    _print(individual) {
        var i = "";
        for (var j = 0; j < individual.length; j++)
            i += individual[j];
        console.log(i);
    }

}

module.exports = GeneticAlgorithm;

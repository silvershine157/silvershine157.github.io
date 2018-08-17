% simulated annealing
domain = -10:0.1:10;
Y = E(domain);
plot(Y)
kmax = 1000;
x = 0;
for k = 1:kmax
    T = temperature(k/kmax);
    nx = neighbor(x);
    if(rand() < P(E(x), E(nx), T))
       x = nx; 
    end
    plot(domain, Y)
    hold on
    plot(x, E(x), 'r*')
    hold off
    pause(0.01)
end

function nx = neighbor(x)
    nx = normrnd(x, 1);
end

function p = P(E1, E2, T)
    % prob of transition from state of energy E1 to state of energy E2
    % given temperature T
    p = 1/(1+exp(-(E1 - E2)/(T + 0.01)));
end

function T = temperature(r)
    T = 1-r;
end

function y = E(x)
    y = 5*sin(0.4*x +3) + 3*sin(0.5*x + 0.3) + 1*sin(1.5*x + 0.1) + 0.1*x.^2;
end
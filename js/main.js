function main(){
	var canvas = document.getElementById('main-disp');
	var ctx = canvas.getContext('2d');
	var running = true;
	var controlled = false;
	var raf;
	var floor = {
		draw: function(){
			ctx.beginPath();
			ctx.moveTo(50,150);
			ctx.lineTo(650,150);
			ctx.stroke();
		}
	};
	var cartpole = {
		x: 0,
		xd: 0,
		a: -Math.PI/24,
		ad: 0,
		L: 1,
		dt: 0.01666,
		m: 1,
		M: 1,
		u: 0,
		g:10,
		scale:100,
		step: function(){
			//calculate xdd, add
			var add = ((this.m+this.M)*this.g*Math.sin(this.a) - this.m*this.L*this.ad*this.ad*Math.sin(this.a)*Math.cos(this.a))/(this.L*(this.m*Math.sin(this.a)*Math.sin(this.a)+this.M))
			-(Math.cos(this.a)*this.u)/(this.L*(this.m*Math.sin(this.a)*Math.sin(this.a)+this.M));
			var xdd = (-this.m*this.g*Math.cos(this.a)*Math.sin(this.a) + this.m*this.L*this.ad*this.ad*Math.sin(this.a))/(this.m*Math.sin(this.a)*Math.sin(this.a)+this.M)
			+this.u/(this.m*Math.sin(this.a)*Math.sin(this.a)+this.M);
			//update state
			this.xd += xdd*this.dt;
			this.ad += add*this.dt;
			this.x += this.xd*this.dt;
			this.a += this.ad*this.dt;

			//put in range
			if(this.a > Math.PI){
				this.a -= Math.PI*2;
			}
			if(this.a < -Math.PI){
				this.a += Math.PI*2;
			}
			var xrange = 10;
			if(this.x < -xrange && this.xd < 0){
				this.xd = 0;
				this.x = 0;
				this.ad = 0;
				this.a = 0.1;
			}
			if(this.x > xrange && this.xd > 0){
				this.xd = 0;
				this.x = 0;
				this.ad = 0;
				this.a = 0.1;
			}
		},

		draw: function(){
			var scale = this.scale;
			var cartX = 350+scale*this.x;
			var cartY = 150;
			ctx.beginPath();
			ctx.moveTo(cartX, cartY);
			ctx.fillRect(cartX-20,cartY-10,40,20);
			ctx.moveTo(cartX, cartY);
			var ballX = cartX+scale*this.L*Math.sin(this.a);
			var ballY = cartY-scale*this.L*Math.cos(this.a);
			ctx.lineTo(ballX,ballY)
			ctx.arc(ballX,ballY,5,0,Math.PI*2, true);
			ctx.stroke();
		}

	};

	function clear(){
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	}

	function control(cp){
		var u = -(-82.8*cp.a-2*cp.x-16.9*cp.ad-5.8*cp.xd);
		return u;
	}

	function display(cp){
		var rd = 1000;
		$('#dispa').text(Math.floor(rd*cp.a)/rd);
		$('#dispad').text(Math.floor(rd*cp.ad)/rd);
		$('#dispx').text(Math.floor(rd*cp.x)/rd);
		$('#dispxd').text(Math.floor(rd*cp.xd)/rd);
		$('#dispu').text(Math.floor(rd*cp.u)/rd);
	}

	function draw(){
		clear();
		floor.draw();
		if(controlled){
			cartpole.u = control(cartpole);
		}
		else{
			cartpole.u = 0;
		}
		cartpole.step();
		display(cartpole);
		cartpole.draw();
		raf = window.requestAnimationFrame(draw);
	}

	canvas.addEventListener('mouseover', function(e){
		controlled = true;
	});

	canvas.addEventListener('mouseout', function(e){
		controlled = false;
	});
	raf = window.requestAnimationFrame(draw);
}

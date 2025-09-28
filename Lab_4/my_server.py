from flask import Flask, request, jsonify

app = Flask(__name__)

def trial_division(n):
    """
    AI generated factorization function using trial division method.
    Returns a list of prime factors for the given integer n.
    """
    if n <= 0:
        return []
    
    if n == 1:
        return [1]
    
    factors = []
    # Handle 2 separately
    while n % 2 == 0:
        factors.append(2)
        n //= 2
    
    # Check odd numbers up to sqrt(n)
    p = 3
    while p * p <= n:
        while n % p == 0:
            factors.append(p)
            n //= p
        p += 2
    
    if n > 1:
        factors.append(n)
    
    return factors

@app.route("/")
def hello():
   return " you called \n"

# curl -d "text=Hello!&param2=value2" -X POST http://localhost:5000/echo
@app.route("/echo", methods=['POST'])
def echo():
   return "You said: " + request.form['text']

# curl -d "number=12" -X POST http://localhost:5000/factors
@app.route("/factors", methods=['POST'])
def get_factors():
    try:
        # Get the integer from the request
        number_str = request.form.get('number')
        if not number_str:
            return jsonify({"error": "Missing 'number' parameter"}), 400
        
        try:
            inINT = int(number_str)
        except ValueError:
            return jsonify({"error": "Invalid integer format"}), 400
        
        if inINT <= 0:
            return jsonify({"error": "Number must be positive"}), 400
        
        # Get factors
        factors = trial_division(inINT)
        
        # Special case for 1 - not prime, return as is
        if inINT == 1:
            return jsonify({"number": inINT, "factors": [1], "is_prime": False})
        
        # If the number is prime (only one factor which is itself), return [inINT]
        if len(factors) == 1 and factors[0] == inINT:
            return jsonify({"number": inINT, "factors": [inINT], "is_prime": True})
        else:
            # For composite numbers, include 1 as the first factor as per example
            factors_with_one = [1] + factors
            return jsonify({"number": inINT, "factors": factors_with_one, "is_prime": False})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
   app.run(host='0.0.0.0', debug=True)
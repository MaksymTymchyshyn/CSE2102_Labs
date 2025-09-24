from flask import Flask, request, jsonify

app = Flask(__name__)

def trial_division(n):
    """
    AI generated factorization function using trial division method.
    Returns a list of prime factors for the given integer n.
    If n is prime, returns [n].
    """
    if n <= 1:
        return []
    
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
    
    # If n is still greater than 1, it's a prime factor
    if n > 1:
        factors.append(n)
    
    return factors

@app.route("/")
def hello():
    return "Flask HTTP Lab 4 - Integer Factorization Service\n"

# curl -d "text=Hello!&param2=value2" -X POST http://localhost:5000/echo
@app.route("/echo", methods=['POST'])
def echo():
    return "You said: " + request.form['text']

# New endpoint for integer factorization
# Usage: curl -X POST -H "Content-Type: application/json" -d '{"number": 12}' http://localhost:5000/factors
# Or: curl -d "number=12" -X POST http://localhost:5000/factors
@app.route("/factors", methods=['POST'])
def get_factors():
    try:
        # Try to get the number from JSON payload first
        if request.is_json:
            data = request.get_json()
            number = data.get('number')
        else:
            # Fall back to form data
            number = request.form.get('number')
        
        if number is None:
            return jsonify({"error": "Missing 'number' parameter"}), 400
        
        # Convert to integer
        try:
            inINT = int(number)
        except ValueError:
            return jsonify({"error": "Invalid number format. Please provide an integer."}), 400
        
        # Validate input
        if inINT < 1:
            return jsonify({"error": "Number must be a positive integer"}), 400
        
        # Get factors
        factors = trial_division(inINT)
        
        # If the number is prime, return [number]
        if len(factors) == 1 and factors[0] == inINT:
            result = [inINT]
        else:
            # For composite numbers, include 1 as the first factor
            result = [1] + factors
        
        return jsonify({
            "number": inINT,
            "factors": result,
            "is_prime": len(factors) == 1 and factors[0] == inINT
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# GET endpoint for easy testing in browser
@app.route("/factors/<int:number>", methods=['GET'])
def get_factors_get(number):
    try:
        if number < 1:
            return jsonify({"error": "Number must be a positive integer"}), 400
        
        factors = trial_division(number)
        
        # If the number is prime, return [number]
        if len(factors) == 1 and factors[0] == number:
            result = [number]
        else:
            # For composite numbers, include 1 as the first factor
            result = [1] + factors
        
        return jsonify({
            "number": number,
            "factors": result,
            "is_prime": len(factors) == 1 and factors[0] == number
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using EmccampDesafio.Models;

namespace EmccampDesafio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private static List<Cliente> _clientes = new List<Cliente>();
        private static int _idCounter = 1;

        // GET: api/Clientes
        [HttpGet]
        public ActionResult<IEnumerable<Cliente>> Get()
        {
            return _clientes;
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public ActionResult<Cliente> Get(int id)
        {
            var cliente = _clientes.Find(c => c.Id == id);
            if (cliente == null)
            {
                return NotFound();
            }
            return cliente;
        }

        // POST: api/Clientes
        [HttpPost]
        public ActionResult<Cliente> Post([FromBody] Cliente cliente)
        {
            cliente.Id = _idCounter++;
            _clientes.Add(cliente);
            return CreatedAtAction(nameof(Get), new { id = cliente.Id }, cliente);
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Cliente cliente)
        {
            var existingCliente = _clientes.Find(c => c.Id == id);
            if (existingCliente == null)
            {
                return NotFound();
            }

            // Atualiza os dados do cliente existente com os dados fornecidos no corpo da solicitação
            existingCliente.Nome = cliente.Nome;
            existingCliente.Email = cliente.Email;
            existingCliente.Telefone = cliente.Telefone;

            return NoContent();
        }


        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var cliente = _clientes.Find(c => c.Id == id);
            if (cliente == null)
            {
                return NotFound();
            }
            _clientes.Remove(cliente);
            return NoContent();
        }
    }
}

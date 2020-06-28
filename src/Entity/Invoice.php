<?php

namespace App\Entity;

use App\Repository\InvoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 *   @ApiResource(
 * subresourceOperations={
 * "api_customers_invoices_get_subresource"={
 * "normalization_context"={"groups"={"invoices_subresource"}}
 * }},
 * itemOperations={"GET", "PUT", "DELETE", "increment"={
 *  "method"="post", 
 *  "path"="invoices/{id}/increment", 
 *  "controller"="App\Controller\InvoiceIncrimentationController",
 *  "openapi_context"={
 *     "summary"="Incremente une facture",
 *     "description"="Incremente le chrono d'une facture"
 *      }
 *  }
 * },
 * attributes={
 *      "pagination_enabled"=true,
 *   },
 *  normalizationContext={
 *      "groups"={"invoices_read"}
 * },
 * denormalizationContext={"disable_type_enforcement"=true}
 * )
 * 
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     *@Assert\NotBlank(message="Le montant est obligatoire")
     *@Assert\Type(type="numeric", message="Le montant doit etre numerique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\DateTime(message="La date doit etre au format YYYY-MM-DD")
     * @Assert\NotBlank(message="Le date est obligatoire")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le status est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Le statut n'est pas le bon")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client est obligatoire")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="LE chrono est obligatoire")
     * @Assert\Type(type="integer",message="Le chrono n'est pas au bon format")
     */
    private $chrono;
/**
 * 
 * Permet de recuperer le user de la facture
 * @Groups({"invoices_read",  "invoices_subresource"})
 * @return User
 */
    public function getUser() : User {
        return $this->customer->getUser();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}

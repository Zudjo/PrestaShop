<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

namespace PrestaShop\PrestaShop\Adapter\Employee;

use InvalidArgumentException;
use PrestaShop\PrestaShop\Core\Employee\Access\EmployeeFormAccessCheckerInterface;
use PrestaShop\PrestaShop\Core\Employee\ContextEmployeeProviderInterface;
use PrestaShop\PrestaShop\Core\Employee\EmployeeDataProviderInterface;

/**
 * Class EmployeeFormAccessChecker checks employee's access to the employee form.
 */
final class EmployeeFormAccessChecker implements EmployeeFormAccessCheckerInterface
{
    /**
     * @var ContextEmployeeProviderInterface
     */
    private $contextEmployeeProvider;

    /**
     * @var EmployeeDataProviderInterface
     */
    private $employeeDataProvider;

    /**
     * @param ContextEmployeeProviderInterface $contextEmployeeProvider
     * @param EmployeeDataProviderInterface $employeeDataProvider
     */
    public function __construct(
        ContextEmployeeProviderInterface $contextEmployeeProvider,
        EmployeeDataProviderInterface $employeeDataProvider
    ) {
        $this->contextEmployeeProvider = $contextEmployeeProvider;
        $this->employeeDataProvider = $employeeDataProvider;
    }

    /**
     * {@inheritdoc}
     */
    public function isRestrictedAccess(int $employeeId): bool
    {
        if (!is_int($employeeId)) {
            throw new InvalidArgumentException(sprintf('Employee ID must be an integer, %s given', gettype($employeeId)));
        }

        return $employeeId === $this->contextEmployeeProvider->getId();
    }

    /**
     * {@inheritdoc}
     */
    public function canAccessEditFormFor(int $employeeId): bool
    {
        // To access super admin edit form you must be a super admin.
        if ($this->employeeDataProvider->isSuperAdmin($employeeId)) {
            return $this->contextEmployeeProvider->isSuperAdmin();
        }

        return true;
    }
}

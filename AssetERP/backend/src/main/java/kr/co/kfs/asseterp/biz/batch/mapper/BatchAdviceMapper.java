package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchAdvAccount;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchSysCorp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 일임(자문) 계좌 가져오기용 asseterpdb 쪽 SQL (ICAM2 읽기는 IcamReader) */
@Mapper
public interface BatchAdviceMapper {

    /** AS-IS sys01_company.selectIcamAdvisCompanyCode — icamCompanyCode에 자문 ICAM 회사코드를 담는다 */
    List<BatchIcamCompany> selectAdvisCompanies(@Param("companyId") String companyId);

    /** AS-IS adv02_account.selectByManageCode (계좌번호 복호화) */
    List<BatchAdvAccount> selectAccountsByManageCode(@Param("companyId") Long companyId, @Param("manageCode") String manageCode);

    /** AS-IS adv02_account.insert */
    int insertAccount(@Param("p") BatchAdvAccount account);

    /** AS-IS adv02_account.update */
    int updateAccount(@Param("p") BatchAdvAccount account);

    /** AS-IS sys15_corp.selectByCorpName2 */
    List<BatchSysCorp> selectCorpsByName(@Param("companyId") Long companyId, @Param("corpType") String corpType, @Param("corpName") String corpName);

    /** AS-IS sys15_corp.insert */
    int insertCorp(@Param("p") BatchSysCorp corp);

    /** AS-IS sys15_corp.updateCorpCode */
    int updateCorpCode(@Param("p") BatchSysCorp corp);
}

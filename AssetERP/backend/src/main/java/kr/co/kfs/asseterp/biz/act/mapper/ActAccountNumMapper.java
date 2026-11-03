package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.AccountNumRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountNumSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act09_account_num.xml — 결산회기관리 */
@Mapper
public interface ActAccountNumMapper {
    /** AS-IS selectByRetrieve */
    List<AccountNumRes> selectByRetrieve(@Param("companyId") Long companyId);

    /** AS-IS selectById (로그인 회사의 행만) */
    AccountNumRes selectById(@Param("accountNumId") Long accountNumId, @Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT */
    int insertAccountNum(@Param("accountNumId") Long accountNumId, @Param("companyId") Long companyId, @Param("req") AccountNumSaveReq req);

    /** UpdateDataModel UPDATE */
    int updateAccountNum(@Param("companyId") Long companyId, @Param("req") AccountNumSaveReq req);

    /** UpdateDataModel.deleteModel */
    int deleteAccountNums(@Param("accountNumIds") List<Long> accountNumIds, @Param("companyId") Long companyId);
}

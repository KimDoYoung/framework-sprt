package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizAccountMapRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountMapSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardUseItemRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BizAccountMapMapper {

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS sys09_code.selectByCodeKind (kindCode = BizCardUseItemCode) */
    List<BizCardUseItemRes> selectUseItems(@Param("companyId") Long companyId, @Param("applyDate") LocalDate applyDate);

    /** AS-IS biz03_account_map.selectByUseItemCode */
    List<BizAccountMapRes> selectByUseItemCode(@Param("companyId") Long companyId, @Param("useItemCode") String useItemCode);

    /** AS-IS UpdateDataModel INSERT (biz03_account_map) */
    int insertAccountMap(@Param("accountMapId") long accountMapId, @Param("companyId") Long companyId, @Param("row") BizAccountMapSaveReq row);

    /** AS-IS UpdateDataModel UPDATE (biz03_account_map) — 화면이 바꾸는 열은 계정과목뿐 */
    int updateAccountMap(@Param("companyId") Long companyId, @Param("row") BizAccountMapSaveReq row);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteAccountMaps(@Param("companyId") Long companyId, @Param("accountMapIds") List<Long> accountMapIds);
}

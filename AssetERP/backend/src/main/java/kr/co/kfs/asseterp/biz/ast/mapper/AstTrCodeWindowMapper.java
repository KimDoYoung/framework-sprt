package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/ast/mapper/ast15_tr_code_window.xml — 화면별 사용 거래코드 */
@Mapper
public interface AstTrCodeWindowMapper {
    /** AS-IS selectByAll: 그 운용사에 등록한 화면(거래코드 없는 행) */
    List<TrCodeWindowRes> selectByAll(@Param("companyId") Long companyId);

    /** AS-IS selectByClassName: 그 화면에 지정된 거래코드 */
    List<TrCodeWindowRes> selectByClassName(@Param("companyId") Long companyId, @Param("className") String className);

    /** AS-IS getTrCode: 아직 그 화면에 지정되지 않은 거래코드 */
    List<TrCodeWindowRes> getTrCode(@Param("companyId") Long companyId, @Param("className") String className);

    /** AS-IS selectById */
    TrCodeWindowRes selectById(@Param("trCodeWindowId") Long trCodeWindowId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT (modelUpdate: 거래코드 null / insert: 거래코드 있음) */
    int insert(@Param("trCodeWindowId") Long trCodeWindowId, @Param("companyId") Long companyId, @Param("className") String className,
               @Param("trCode") String trCode, @Param("note") String note);

    /** UpdateDataModel.deleteModel — 회사 조건을 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS deleteClassName */
    int deleteClassName(@Param("companyId") Long companyId, @Param("className") String className);
}
